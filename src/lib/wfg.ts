import type { ProcessId, ResourceId } from "../types/graphIds";
import type { ResourceAllocationGraph } from "../types/rag";
import type { WaitForEdge, WaitForGraph, WaitForGraphStep } from "../types/wfg";


/**
 *  function to build a wait-for graph from a resource allocation graph
 * @param rag resource allocation graph
 * @returns wait-for graph
 */
export function buildWaitForGraph(rag: ResourceAllocationGraph): WaitForGraph {

  const resourceOwner = new Map<ResourceId, ProcessId>();

  for (const edge of rag.edges) {
    if (edge.kind === "allocation") {
      const resource = edge.from as ResourceId;
      const process = edge.to as ProcessId;
      resourceOwner.set(resource, process);
    }
  }

  const edges: WaitForEdge[] = [];

  for (const edge of rag.edges) {
    if (edge.kind === "request") {
      const waitingProcess = edge.from as ProcessId;
      const requestedResource = edge.to as ResourceId;

      const owner = resourceOwner.get(requestedResource);
      if (owner !== undefined) {
        edges.push({ from: waitingProcess, to: owner });
      }
    }
  }

  return {
    processes: rag.processes,
    edges,
  };
}

/**
 * function to build steps for visualizing the construction of a wait-for graph
 * @param wfg wait-for graph
 * @returns s teps for visualization
 */
export function buildWfgSteps(wfg: WaitForGraph): WaitForGraphStep[] {
  const steps: WaitForGraphStep[] = [];

  // no edges yet
  const firstProcess: ProcessId = wfg.processes[0] ?? "P1";
  steps.push({
    description: `Start with process ${firstProcess}.`,
    edges: [],
  });

  let currentEdges: WaitForEdge[] = [];
  wfg.edges.forEach((edge) => {
    currentEdges = [...currentEdges, edge];
    steps.push({
      description: `Add edge ${edge.from} -> ${edge.to}`,
      edges: currentEdges,
    });
  });

  return steps;
}

/**
 * Example WFG and node positions for visualization.
 */
export interface WfgNodePosition {
  id: ProcessId;
  x: number;
  y: number;
}

export const wfgNodePositions: WfgNodePosition[] = [
  { id: "P1", x: 30, y: 125 },
  { id: "P2", x: 150, y: 40 },
  { id: "P3", x: 270, y: 125 },
];

export const wfgNodePositions2: WfgNodePosition[] = [
  { id: "P1", x: 30, y: 125 },
  { id: "P2", x: 150, y: 125 },
  { id: "P3", x: 270, y: 125 },
  { id: "P4", x: 150, y: 220 },
  { id: "P5", x: 150, y: 20 },

];


export function getWfgNodePos(
  id: ProcessId,
  positions: WfgNodePosition[] = wfgNodePositions
): WfgNodePosition {
  const pos = positions.find((n) => n.id === id);
  if (!pos) throw new Error(`No WFG position for node ${id}`);
  return pos;
}



