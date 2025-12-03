export interface DetectionStep {
  description: string;
  visited: ProcessId[];
  edge?: WaitForEdge;
  cycle?: ProcessId[];
}