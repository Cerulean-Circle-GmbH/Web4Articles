// Completion interface for oosh CLI completion backend
export interface Completion {
  complete(args: string[]): string[];
}
