import type { ProcessId, ResourceId } from "./graphIds";

export interface ResourceAllocationGraph {
  processes: ProcessId[];
  resources: ResourceId[];
  edges: RagEdge[];
}

export type NodeId = ProcessId | ResourceId;
export type EdgeKind = "allocation" | "request";

export interface RagEdge {
  from: NodeId;
  to: NodeId;
  kind: EdgeKind;
}

interface NodePosition {
  id: NodeId;
  x: number;
  y: number;
  kind: "process" | "resource";
}
