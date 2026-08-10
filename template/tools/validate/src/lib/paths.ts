import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// This package lives at <repo>/tools/validate ; the repo root also holds
// product/ and schemas/ (same layout in the monorepo template/ and in an
// instantiated repository).
const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const repoRoot = path.resolve(pkgRoot, '..', '..');
export const defaultProductRoot = path.join(repoRoot, 'product');
export const schemaPath = path.join(repoRoot, 'schemas', '0.1', 'asset.schema.json');
