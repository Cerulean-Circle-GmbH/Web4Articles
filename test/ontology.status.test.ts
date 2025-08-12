import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function countListItems(markdown: string): number {
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('- '))
    .length;
}

function countTableRows(markdown: string): number {
  const lines = markdown.split(/\r?\n/);
  return lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) return false;
    if (/^\|\s*-+\s*\|/.test(trimmed)) return false; // separator row
    if (/^\|\s*(Noun|Verb|Term)\s*\|/i.test(trimmed)) return false; // header row
    if (/^\|\s*------/i.test(trimmed)) return false; // generic header separator
    // assume data row if it has multiple pipes
    return (trimmed.match(/\|/g) || []).length >= 5;
  }).length;
}

function parseStatusCounts(markdown: string): { nouns: number; verbs: number; ambiguities: number } {
  const nounsMatch = markdown.match(/-\s*Nouns:\s*(\d+)/i);
  const verbsMatch = markdown.match(/-\s*Verbs:\s*(\d+)/i);
  const ambMatch = markdown.match(/-\s*Ambiguities:\s*(\d+)/i);
  if (!nounsMatch || !verbsMatch || !ambMatch) {
    throw new Error('Failed to parse counts from ontology.status.md');
  }
  return {
    nouns: Number(nounsMatch[1]),
    verbs: Number(verbsMatch[1]),
    ambiguities: Number(ambMatch[1]),
  };
}

describe('Ontology status consistency', () => {
  it('matches counts in ontology.status.md with index files', () => {
    const docRoot = resolve(__dirname, '..', 'Documentation', 'Ontology.md');
    const wikiRoot = resolve(__dirname, '..', 'wiki', 'ontology');

    const pickRoot = (rootPath: string) => (
      existsSync(rootPath) &&
      existsSync(resolve(rootPath, 'nouns.index.md')) &&
      existsSync(resolve(rootPath, 'verbs.index.md')) &&
      existsSync(resolve(rootPath, 'ambiguities.index.md')) &&
      existsSync(resolve(rootPath, 'ontology.status.md'))
    )
      ? rootPath
      : '';

    const root = pickRoot(docRoot) || pickRoot(wikiRoot);

    if (!root) {
      // Gracefully skip if ontology indexes are not present in either location
      expect(true).toBe(true);
      return;
    }

    const nounsIdx = readFileSync(resolve(root, 'nouns.index.md'), 'utf8');
    const verbsIdx = readFileSync(resolve(root, 'verbs.index.md'), 'utf8');
    const ambIdx = readFileSync(resolve(root, 'ambiguities.index.md'), 'utf8');
    const status = readFileSync(resolve(root, 'ontology.status.md'), 'utf8');

    const nounsCount = countTableRows(nounsIdx) || countListItems(nounsIdx);
    const verbsCount = countTableRows(verbsIdx) || countListItems(verbsIdx);
    const ambCount = countTableRows(ambIdx) || countListItems(ambIdx);

    const parsed = parseStatusCounts(status);

    expect(parsed.nouns).toBe(nounsCount);
    expect(parsed.verbs).toBe(verbsCount);
    expect(parsed.ambiguities).toBe(ambCount);
  });
});