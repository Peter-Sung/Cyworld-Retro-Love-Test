
import { getStrokeCount } from './hangulStrokes';
import { CompatibilityResult } from '../types';

export const calculateCompatibility = (name1: string, name2: string): CompatibilityResult => {
  const maxLength = Math.max(name1.length, name2.length);
  const strokes: number[] = [];

  // Interleave the characters: A[0], B[0], A[1], B[1]...
  for (let i = 0; i < maxLength; i++) {
    if (name1[i]) strokes.push(getStrokeCount(name1[i]));
    if (name2[i]) strokes.push(getStrokeCount(name2[i]));
  }

  const steps: number[][] = [strokes];
  let current = strokes;

  // Reduce until only two digits remain
  while (current.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10);
    }
    steps.push(next);
    current = next;
  }

  const finalScore = current[0] * 10 + current[1];

  return {
    names: [name1, name2],
    steps,
    finalScore
  };
};
