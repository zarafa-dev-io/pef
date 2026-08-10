// PEF 0.1 core model constants. Contract source of truth: ../../schemas/0.1/asset.schema.json
// and PRD EF-2 (ID prefixes), EF-3 (relations), EF-4 (statuses), EF-35 (file suffixes).

export const RELATION_KEYS = [
  'refines',
  'satisfies',
  'verifies',
  'dependsOn',
  'supersedes',
  'impacts',
  'documents',
] as const;

export type RelationKey = (typeof RELATION_KEYS)[number];

export const ASSET_TYPES = [
  'Vision',
  'Goal',
  'Roadmap',
  'Persona',
  'WorkItem',
  'Requirement',
  'BusinessRule',
  'NonFunctionalRequirement',
  'Specification',
  'AcceptanceCriteria',
  'TestPlan',
  'TestCase',
  'Decision',
  'Release',
  'Documentation',
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

const PREFIX_BY_TYPE: Record<string, string> = {
  Vision: 'VIS',
  Goal: 'GOAL',
  Roadmap: 'RM',
  Persona: 'PER',
  Requirement: 'REQ',
  BusinessRule: 'BR',
  NonFunctionalRequirement: 'NFR',
  Specification: 'SPEC',
  AcceptanceCriteria: 'AC',
  TestPlan: 'TP',
  TestCase: 'TC',
  Decision: 'DEC',
  Release: 'REL',
  Documentation: 'DOC',
};

const PREFIX_BY_WORKITEM_TYPE: Record<string, string> = {
  Epic: 'EPIC',
  UserStory: 'US',
  Bug: 'BUG',
};

export interface FrontMatter {
  pefVersion?: string;
  assetType?: string;
  id?: string;
  title?: string;
  status?: string;
  version?: string;
  workItemType?: string;
  docType?: string;
  workflowState?: string;
  priority?: string;
  externalRef?: string;
  codeRefs?: string[];
  ai?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Expected ID prefix for an asset, or undefined when it cannot be derived. */
export function expectedPrefix(fm: FrontMatter): string | undefined {
  if (fm.assetType === 'WorkItem') {
    return fm.workItemType ? PREFIX_BY_WORKITEM_TYPE[fm.workItemType] : undefined;
  }
  return fm.assetType ? PREFIX_BY_TYPE[fm.assetType] : undefined;
}

/** Expected file suffix (EF-35): lowercase of the ID prefix, e.g. SPEC -> .spec.md */
export function expectedSuffix(fm: FrontMatter): string | undefined {
  const prefix = expectedPrefix(fm);
  return prefix ? prefix.toLowerCase() : undefined;
}

export const ALL_SUFFIXES = [
  ...Object.values(PREFIX_BY_TYPE),
  ...Object.values(PREFIX_BY_WORKITEM_TYPE),
].map((p) => p.toLowerCase());

// EF-30: WorkItem realization axis, independent from the content-validity axis
// (status). Adjacent moves only, forward and backward.
export const ALLOWED_WORKFLOW_TRANSITIONS: Record<string, string[]> = {
  Drafting: ['Todo'],
  Todo: ['Drafting', 'InProgress'],
  InProgress: ['Todo', 'Validated'],
  Validated: ['InProgress'],
};

// EF-4: Draft -> Review -> Approved -> Deprecated (+ Generated for unreviewed AI output).
// Going back to Draft/Review is allowed (content re-enters review); skipping review
// (Draft -> Approved) and approving Generated content directly are not (EF-18).
export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  Draft: ['Review', 'Deprecated'],
  Review: ['Draft', 'Approved', 'Deprecated'],
  Approved: ['Draft', 'Review', 'Deprecated'],
  Generated: ['Draft', 'Review', 'Deprecated'],
  Deprecated: [],
};
