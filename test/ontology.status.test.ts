import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function countListItems(markdown: string): number {
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('- '))
    .length;
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
    const wikiRoot = resolve(__dirname, '..', 'wiki', 'ontology');

    const nounsIdx = readFileSync(resolve(wikiRoot, 'nouns.index.md'), 'utf8');
    const verbsIdx = readFileSync(resolve(wikiRoot, 'verbs.index.md'), 'utf8');
    const ambIdx = readFileSync(resolve(wikiRoot, 'ambiguities.index.md'), 'utf8');
    const status = readFileSync(resolve(wikiRoot, 'ontology.status.md'), 'utf8');

    const nounsCount = countListItems(nounsIdx);
    const verbsCount = countListItems(verbsIdx);
    const ambCount = countListItems(ambIdx);

    const parsed = parseStatusCounts(status);

    expect(parsed.nouns).toBe(nounsCount);
    expect(parsed.verbs).toBe(verbsCount);
    expect(parsed.ambiguities).toBe(ambCount);
  });
});