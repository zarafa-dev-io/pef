import { assetOfId, type AssetGraph } from '../lib/graph.js';

const label = (graph: AssetGraph, id: string): string => {
  const asset = assetOfId(graph, id);
  if (!asset?.fm) return `${id} (missing)`;
  return `${id} — ${asset.fm.title} [${asset.fm.status}]`;
};

function upstream(graph: AssetGraph, id: string, indent: string, visited: Set<string>, lines: string[]): void {
  for (const ref of graph.outbound.get(id) ?? []) {
    lines.push(`${indent}└─ ${ref.key} → ${label(graph, ref.target)}`);
    if (!visited.has(ref.target)) {
      visited.add(ref.target);
      upstream(graph, ref.target, indent + '   ', visited, lines);
    }
  }
}

function downstream(graph: AssetGraph, id: string, indent: string, visited: Set<string>, lines: string[]): void {
  for (const ref of graph.inbound.get(id) ?? []) {
    lines.push(`${indent}└─ ${ref.key} ← ${label(graph, ref.source)}`);
    if (!visited.has(ref.source)) {
      visited.add(ref.source);
      downstream(graph, ref.source, indent + '   ', visited, lines);
    }
  }
}

/** EF-13: bidirectional traceability chain of one asset. */
export function runTrace(graph: AssetGraph, id: string): string[] {
  const asset = assetOfId(graph, id);
  if (!asset) return [`unknown asset id "${id}"`];
  const lines: string[] = [`${label(graph, id)}  (${asset.rel})`, '', 'Upstream (this asset points to):'];
  const before = lines.length;
  upstream(graph, id, '  ', new Set([id]), lines);
  if (lines.length === before) lines.push('  (none)');
  lines.push('', 'Downstream (assets pointing here):');
  const mid = lines.length;
  downstream(graph, id, '  ', new Set([id]), lines);
  if (lines.length === mid) lines.push('  (none)');
  return lines;
}
