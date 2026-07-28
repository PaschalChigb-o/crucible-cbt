import type { Question } from "./questionLoader";
import { shuffle } from "./shuffle";

const SEEN_KEY = (c: string) => `${c}_seen`;

export function getSeen(courseCode: string): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY(courseCode));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function markSeen(courseCode: string, ids: string[]) {
  const seen = getSeen(courseCode);
  for (const id of ids) seen.add(id);
  localStorage.setItem(SEEN_KEY(courseCode), JSON.stringify([...seen]));
}

export function clearSeen(courseCode: string) {
  localStorage.removeItem(SEEN_KEY(courseCode));
}

/**
 * Filter to remove any question whose variant_of parent is also in the
 * candidate list, or which has a variant already included.
 */
export function filterVariants(list: Question[]): Question[] {
  const ids = new Set(list.map((q) => q.id));
  const picked: Question[] = [];
  const pickedIds = new Set<string>();
  const pickedParents = new Set<string>();

  for (const q of list) {
    if (q.variant_of && (ids.has(q.variant_of) || pickedIds.has(q.variant_of)))
      continue;
    if (pickedParents.has(q.id)) continue;
    picked.push(q);
    pickedIds.add(q.id);
    if (q.variant_of) pickedParents.add(q.variant_of);
  }
  return picked;
}

/**
 * Build a session's question list: filter unseen, shuffle, apply variant
 * filter, cap at `count`. If not enough unseen remain, reset the seen store
 * and reuse all questions.
 */
export function buildSessionQuestions(
  courseCode: string,
  all: Question[],
  count: number,
): Question[] {
  if (all.length === 0) return [];
  const seen = getSeen(courseCode);
  let unseen = all.filter((q) => !seen.has(q.id));
  if (unseen.length < Math.min(count, all.length)) {
    clearSeen(courseCode);
    unseen = all.slice();
  }
  const shuffled = shuffle(unseen);
  const filtered = filterVariants(shuffled);
  return filtered.slice(0, Math.min(count, filtered.length));
}
