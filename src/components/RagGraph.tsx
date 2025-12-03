import { shortenLine } from "../lib/shorten-line";
import { getNodePos } from "../lib/rag";
import type { NodePosition, ResourceAllocationGraph } from "../types/rag";

interface RagGraphProps {
    graph: ResourceAllocationGraph;
    positions: NodePosition[];
}

/**
 * function to render the resource allocation graph
 * @param param0 graph, positions
 * @returns the rendered RAG component
 */
export default function RagGraph({ graph, positions }: RagGraphProps) {
    return (
        <svg width={300} height={250} style={{ background: "#111", borderRadius: 12 }}>
            <defs>
                <marker
                    id="arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                >
                    <polygon points="0 0, 8 4, 0 8" fill="#ffffff" />
                </marker>
            </defs>


            {graph.edges.map((edge, index) => {
                const from = getNodePos(edge.from, positions);
                const to = getNodePos(edge.to, positions);
                const isRequest = edge.kind === "request";

                const { x2, y2 } = shortenLine(
                    from.x,
                    from.y,
                    to.x,
                    to.y,
                    to.kind
                );

                return (
                    <line
                        key={index}
                        x1={from.x}
                        y1={from.y}
                        x2={x2}
                        y2={y2}
                        stroke={isRequest ? "#ffbc42" : "#4b9fff"}
                        strokeWidth={2}
                        markerEnd="url(#arrow)"
                    />
                );
            })}

            {positions.map((node) => (
                <g key={node.id}>
                    {node.kind === "process" ? (
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={18}
                            fill="#222"
                            stroke="#a0ffae"
                            strokeWidth={2}
                        />
                    ) : (
                        <rect
                            x={node.x - 16}
                            y={node.y - 16}
                            width={32}
                            height={32}
                            rx={4}
                            fill="#222"
                            stroke="#ffffff"
                            strokeWidth={2}
                        />
                    )}
                    <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#ffffff"
                    >
                        {node.id}
                    </text>
                </g>
            ))}
        </svg>
    );
}
