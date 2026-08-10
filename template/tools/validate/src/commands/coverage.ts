import type { ParsedAsset } from '../lib/assets.js';
import { downstreamIds, outboundRefs, upstreamIds, type AssetGraph } from '../lib/graph.js';

export interface Gap {
  category: string;
  assetId: string;
  file: string;
  message: string;
}

const typeOf = (graph: AssetGraph, id: string): string | undefined =>
  graph.byId.get(id)?.[0]?.fm?.assetType as string | undefined;

/**
 * Coverage rules — lot 1 (EF-12): REQ/SPEC/AC chain, orphans, broken refs ;
 * lot 2 (EF-12, EF-32): Epic/UserStory/Bug chain and workflowState consistency ;
 * lot 3 (EF-9, EF-12): upstream chain Goal/Roadmap ;
 * lot 4 (EF-12, EF-28): Documentation coverage and staleness.
 */
export function runCoverage(assets: ParsedAsset[], graph: AssetGraph): Gap[] {
  const gaps: Gap[] = [];
  const valid = assets.filter((a): a is ParsedAsset & { fm: NonNullable<ParsedAsset['fm']> } =>
    Boolean(a.fm && typeof a.fm.id === 'string'));

  const specsSatisfying = (reqId: string): string[] =>
    (graph.inbound.get(reqId) ?? [])
      .filter((r) => r.key === 'satisfies' && typeOf(graph, r.source) === 'Specification')
      .map((r) => r.source);

  const acsRefining = (specId: string): string[] =>
    (graph.inbound.get(specId) ?? [])
      .filter((r) => r.key === 'refines' && typeOf(graph, r.source) === 'AcceptanceCriteria')
      .map((r) => r.source);

  for (const asset of valid) {
    const { id, assetType, status } = asset.fm as { id: string; assetType: string; status: string };
    if (status === 'Deprecated') continue;

    if (assetType === 'Requirement') {
      const specs = specsSatisfying(id);
      if (specs.length === 0) {
        gaps.push({ category: 'requirement-without-spec', assetId: id, file: asset.rel,
          message: `Requirement ${id} has no Specification satisfying it` });
      }
      if (!specs.some((s) => acsRefining(s).length > 0)) {
        gaps.push({ category: 'requirement-without-ac', assetId: id, file: asset.rel,
          message: `Requirement ${id} is not covered by any AcceptanceCriteria (via its Specifications)` });
      }
    }

    if (assetType === 'Specification' && acsRefining(id).length === 0) {
      gaps.push({ category: 'spec-without-ac', assetId: id, file: asset.rel,
        message: `Specification ${id} has no AcceptanceCriteria refining it` });
    }

    if (assetType === 'Specification' && status === 'Approved') {
      const docs = (graph.inbound.get(id) ?? [])
        .filter((r) => r.key === 'documents' && typeOf(graph, r.source) === 'Documentation');
      if (docs.length === 0) {
        gaps.push({ category: 'spec-approved-without-doc', assetId: id, file: asset.rel,
          message: `Approved Specification ${id} is covered by no Documentation` });
      }
    }

    if (assetType === 'Documentation') {
      const documented = outboundRefs(asset).filter((r) => r.key === 'documents');
      if (documented.length === 0) {
        gaps.push({ category: 'doc-without-documents', assetId: id, file: asset.rel,
          message: `Documentation ${id} references no asset ("documents" is empty)` });
      }
      if (status === 'Approved' && asset.fm.coveredVersions) {
        for (const [coveredId, recordedVersion] of Object.entries(asset.fm.coveredVersions)) {
          const currentVersion = graph.byId.get(coveredId)?.[0]?.fm?.version;
          if (typeof currentVersion === 'string' && currentVersion !== recordedVersion) {
            gaps.push({ category: 'stale-doc', assetId: id, file: asset.rel,
              message: `Documentation ${id} was approved against ${coveredId} v${recordedVersion}, now v${currentVersion} — refresh needed` });
          }
        }
      }
    }

    if (assetType === 'Goal') {
      const hasWorkItem = [...downstreamIds(graph, id)].some((t) => typeOf(graph, t) === 'WorkItem');
      if (!hasWorkItem) {
        gaps.push({ category: 'goal-without-workitem', assetId: id, file: asset.rel,
          message: `Goal ${id} has no WorkItem in its downstream chain` });
      }
    }

    if (assetType === 'Roadmap') {
      const goals = outboundRefs(asset)
        .filter((r) => r.key === 'satisfies' && typeOf(graph, r.target) === 'Goal');
      if (goals.length === 0) {
        gaps.push({ category: 'roadmap-without-goal', assetId: id, file: asset.rel,
          message: `Roadmap element ${id} satisfies no Goal` });
      }
    }

    if (assetType === 'WorkItem') {
      const workItemType = asset.fm.workItemType as string | undefined;
      const workflowState = asset.fm.workflowState as string | undefined;
      const down = [...downstreamIds(graph, id)];
      const downByType = (t: string) => down.filter((d) => typeOf(graph, d) === t);
      const regressionTests = outboundRefs(asset)
        .filter((r) => r.key === 'dependsOn' && typeOf(graph, r.target) === 'TestCase');

      if (workItemType === 'Epic') {
        const stories = (graph.inbound.get(id) ?? []).filter((r) =>
          r.key === 'refines' && graph.byId.get(r.source)?.[0]?.fm?.workItemType === 'UserStory');
        if (stories.length === 0) {
          gaps.push({ category: 'epic-without-userstory', assetId: id, file: asset.rel,
            message: `Epic ${id} has no UserStory refining it` });
        }
      }

      if (workItemType === 'UserStory' && downByType('AcceptanceCriteria').length === 0) {
        gaps.push({ category: 'userstory-without-ac', assetId: id, file: asset.rel,
          message: `UserStory ${id} has no AcceptanceCriteria in its downstream chain` });
      }

      if (workItemType === 'Bug' && regressionTests.length === 0) {
        gaps.push({ category: 'bug-without-regression-test', assetId: id, file: asset.rel,
          message: `Bug ${id} has no non-regression TestCase (dependsOn a TC-)` });
      }

      if (workflowState === 'Validated' &&
          downByType('TestCase').length === 0 && regressionTests.length === 0) {
        gaps.push({ category: 'workitem-validated-without-testcase', assetId: id, file: asset.rel,
          message: `WorkItem ${id} is Validated but no TestCase verifies its chain` });
      }

      if (workflowState === 'InProgress') {
        const draftUpstream = [...upstreamIds(graph, id)]
          .filter((t) => graph.byId.get(t)?.[0]?.fm?.status === 'Draft');
        if (draftUpstream.length > 0) {
          gaps.push({ category: 'workitem-inprogress-upstream-draft', assetId: id, file: asset.rel,
            message: `WorkItem ${id} is InProgress but upstream asset(s) went back to Draft: ${draftUpstream.join(', ')}` });
        }
      }
    }

    if (assetType === 'AcceptanceCriteria') {
      const tcs = (graph.inbound.get(id) ?? [])
        .filter((r) => r.key === 'verifies' && typeOf(graph, r.source) === 'TestCase');
      if (tcs.length === 0) {
        gaps.push({ category: 'ac-without-testcase', assetId: id, file: asset.rel,
          message: `AcceptanceCriteria ${id} is not verified by any TestCase` });
      }
    }

    // Orphans: no relation in either direction. Decisions are standalone by nature.
    if (assetType !== 'Decision') {
      const hasOut = (graph.outbound.get(id) ?? []).length > 0;
      const hasIn = (graph.inbound.get(id) ?? []).length > 0;
      if (!hasOut && !hasIn) {
        gaps.push({ category: 'orphan-asset', assetId: id, file: asset.rel,
          message: `${assetType} ${id} has no relation to any other asset` });
      }
    }

    // Broken refs are validation errors too (PEF006) but EF-12 lists them in coverage.
    for (const ref of outboundRefs(asset)) {
      if (!graph.byId.has(ref.target)) {
        gaps.push({ category: 'broken-ref', assetId: id, file: asset.rel,
          message: `${id} references missing asset "${ref.target}" via "${ref.key}"` });
      }
    }
  }

  gaps.sort((a, b) => a.category.localeCompare(b.category) || a.assetId.localeCompare(b.assetId));
  return gaps;
}
