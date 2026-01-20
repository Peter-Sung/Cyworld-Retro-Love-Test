
export interface CompatibilityResult {
  names: [string, string];
  steps: number[][];
  finalScore: number;
}

export interface JamoStrokeMap {
  [key: string]: number;
}
