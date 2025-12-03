import type { NodeId, NodePosition, ResourceAllocationGraph } from "../types/rag";

/**
 * Example RAG and node positions for visualization.
 */
export const ragNodePositions: NodePosition[] = [

    { id: "P1", x: 140, y: 30, kind: "process" },
    { id: "P2", x: 260, y: 30, kind: "process" },
    { id: "P3", x: 155, y: 200, kind: "process" },


    { id: "R1", x: 40, y: 30, kind: "resource" },
    { id: "R2", x: 260, y: 125, kind: "resource" },

];

export const ragExample: ResourceAllocationGraph = {
    processes: ["P1", "P2", "P3"],
    resources: ["R1", "R2"],
    edges: [
        { from: "R1", to: "P1", kind: "allocation" },
        { from: "R2", to: "P2", kind: "allocation" },
        
        { from: "P3", to: "R1", kind: "request" },
        { from: "P3", to: "R2", kind: "request" },
    ],
};

export const ragNodePositions2: NodePosition[] = [
    { id: "P1", x: 30, y: 160, kind: "process" },
    { id: "P2", x: 155, y: 160, kind: "process" },
    { id: "P3", x: 270, y: 160, kind: "process" },
    { id: "P4", x: 155, y: 230, kind: "process" },
    { id: "P5", x: 155, y: 20, kind: "process" },

    { id: "R1", x: 30, y: 90, kind: "resource" },
    { id: "R2", x: 30, y: 230, kind: "resource" },
    { id: "R3", x: 155, y: 90, kind: "resource" },
    { id: "R4", x: 270, y: 90, kind: "resource" },
    { id: "R5", x: 270, y: 230, kind: "resource" },
];

export const ragExample2: ResourceAllocationGraph = {
    processes: ["P1", "P2", "P3", "P4", "P5"],
    resources: ["R1", "R2", "R3", "R4", "R5"],
    edges: [
        { from: "R1", to: "P2", kind: "allocation" },
        { from: "R2", to: "P1", kind: "allocation" },
        { from: "R3", to: "P5", kind: "allocation" },
        { from: "R4", to: "P3", kind: "allocation" },
        { from: "R5", to: "P4", kind: "allocation" },

        { from: "P1", to: "R1", kind: "request" },
        { from: "P2", to: "R3", kind: "request" },
        { from: "P2", to: "R4", kind: "request" },
        { from: "P2", to: "R5", kind: "request" },
        { from: "P3", to: "R5", kind: "request" },
        { from: "P4", to: "R2", kind: "request" },
    ],
};

// function to get node position by id
export function getNodePos(id: NodeId, positions: NodePosition[] = ragNodePositions): NodePosition {
    const pos = positions.find((n) => n.id === id);
    if (!pos) {
        throw new Error(`No position for node ${id}`);
    }
    return pos;
}