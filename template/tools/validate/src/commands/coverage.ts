import type { ParsedAsset } from '../lib/assets.js';
import { outboundRefs, type AssetGraph } from '../lib/graph.js';

export interface Gap {
  category: string;
  assetId: string;
  file: string;
  message: string;
}

const typeOf = (graph: AssetGraph, id: string): string | undefined =>
  graph.byId.get(id)?.[0]?.fm?.assetType as string | undefined;

/** Lot 1 coverage rules (EF-12): REQ/SPEC/AC chain, orphans, broken refs. */
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
