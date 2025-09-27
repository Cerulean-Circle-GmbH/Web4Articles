/**
 * StorageModel Interface - Storage state management
 * Web4 principle: Single interface per file
 */

export interface StorageModel {
  uuid: string;
  projectRoot: string;
  indexBaseDir: string;
  createdAt: string;
  updatedAt: string;
}