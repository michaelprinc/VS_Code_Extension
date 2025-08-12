export type InstructionId =
  | 'base-short'
  | 'base-standard'
  | 'code-review'
  | 'security'
  | 'performance'
  | 'python-ds';

export interface InstructionMapping {
  // Informational mapping (for display/validation)
  versions: Record<InstructionId, string>; // e.g., "v1.2.3"
  paths: Record<InstructionId, string>;    // repo-relative paths to *.md
}

export interface SelectionState {
  base: 'base-short' | 'base-standard';
  addOns: InstructionId[];
}
