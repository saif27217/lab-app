import { LAB_TESTS } from './labTests.ts';

export function searchTests(query: string, limit = 100): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return LAB_TESTS
    .filter((t) => t.toLowerCase().includes(q))
    .slice(0, limit);
}

export function highlightSegments(text: string, query: string): { part: string; hit: boolean }[] {
  const q = query.trim();
  if (!q) return [{ part: text, hit: false }];
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return [{ part: text, hit: false }];
  return [
    ...(idx > 0 ? [{ part: text.slice(0, idx), hit: false }] : []),
    { part: text.slice(idx, idx + q.length), hit: true },
    ...(idx + q.length < text.length ? [{ part: text.slice(idx + q.length), hit: false }] : []),
  ];
}
