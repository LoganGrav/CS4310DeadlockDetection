export interface WaitForEdge {
  from: ProcessId;
  to: ProcessId;
}

export interface WaitForGraph {
  processes: ProcessId[];
  edges: WaitForEdge[];
}

export interface WaitForGraphStep {
  description: string;
  edges: WaitForEdge[];
}