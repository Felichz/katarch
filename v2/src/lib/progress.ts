const KEY = 'katarch:v2:progress';

export type Progress = Record<string, { max: number; total: number; done: boolean }>;

export function readProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveProgress(chapter: string, index: number, total: number) {
  try {
    const p = readProgress();
    const prev = p[chapter] ?? { max: 0, total, done: false };
    const max = Math.max(prev.max, index);
    p[chapter] = { max, total, done: prev.done || index === total - 1 };
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}
