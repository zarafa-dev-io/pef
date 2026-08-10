import { assetOfId, type AssetGraph } from '../lib/graph.js';

export interface ImpactedAsset {
  id: string;
  assetType: string;
  title: string;
  file: string;
  via: string;
}

/**
 * EF-24: transitive downstream closure of an asset — everything that directly or
 * indirectly references it, TestPlans/TestCases highlighted by the CLI output.
 */
export function runImpact(graph: AssetGraph, id: string): ImpactedAsset[] | null {
  if (!assetOfId(graph, id)) return null;
  const impacted: ImpactedAsset[] = [];
  const visited = new Set<string>([id]);
  const queue: { id: string; via: string }[] = [{ id, via: id }];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const ref of graph.inbound.get(current.id) ?? []) {
      if (visited.has(ref.source)) continue;
      visited.add(ref.source);
      const asset = assetOfId(graph, ref.source);
      if (asset?.fm) {
        impacted.push({
          id: ref.source,
          assetType: String(asset.fm.assetType),
          title: String(asset.fm.title),
          file: asset.rel,
          via: `${ref.key} ${current.id}`,
        });
      }
      queue.push({ id: ref.source, via: current.id });
    }
  }
  return impacted;
}
