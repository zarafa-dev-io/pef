import { RELATION_KEYS } from './model.js';
import type { ParsedAsset } from './assets.js';

export interface OutboundRef {
  key: string;
  target: string;
}

export interface InboundRef {
  key: string;
  source: string;
}

export interface AssetGraph {
  /** id -> assets claiming that id (length > 1 means duplicate) */
  byId: Map<string, ParsedAsset[]>;
  outbound: Map<string, OutboundRef[]>;
  inbound: Map<string, InboundRef[]>;
}

export function outboundRefs(asset: ParsedAsset): OutboundRef[] {
  const refs: OutboundRef[] = [];
  if (!asset.fm) return refs;
  for (const key of RELATION_KEYS) {
    const value = asset.fm[key];
    if (Array.isArray(value)) {
      for (const target of value) {
        if (typeof target === 'string') refs.push({ key, target });
      }
    }
  }
  return refs;
}

export function buildGraph(assets: ParsedAsset[]): AssetGraph {
  const byId = new Map<string, ParsedAsset[]>();
  const outbound = new Map<string, OutboundRef[]>();
  const inbound = new Map<string, InboundRef[]>();
  for (const asset of assets) {
    const id = asset.fm?.id;
    if (typeof id !== 'string' || id.length === 0) continue;
    byId.set(id, [...(byId.get(id) ?? []), asset]);
    const refs = outboundRefs(asset);
    outbound.set(id, [...(outbound.get(id) ?? []), ...refs]);
    for (const ref of refs) {
      inbound.set(ref.target, [...(inbound.get(ref.target) ?? []), { key: ref.key, source: id }]);
    }
  }
  return { byId, outbound, inbound };
}

export function assetOfId(graph: AssetGraph, id: string): ParsedAsset | undefined {
  return graph.byId.get(id)?.[0];
}

/** Transitive closure of assets referencing `id`, directly or indirectly (excludes `id`). */
export function downstreamIds(graph: AssetGraph, id: string): Set<string> {
  return closure(id, (current) => (graph.inbound.get(current) ?? []).map((r) => r.source));
}

/** Transitive closure of assets `id` references, directly or indirectly (excludes `id`). */
export function upstreamIds(graph: AssetGraph, id: string): Set<string> {
  return closure(id, (current) => (graph.outbound.get(current) ?? []).map((r) => r.target));
}

function closure(start: string, next: (id: string) => string[]): Set<string> {
  const visited = new Set<string>([start]);
  const queue = [start];
  while (queue.length > 0) {
    for (const neighbour of next(queue.shift()!)) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  visited.delete(start);
  return visited;
}
