import { shortenLine } from "../lib/shorten-line";
import { getWfgNodePos, type WfgNodePosition } from "../lib/wfg";
import type { ProcessId } from "../types/graphIds";
import type { WaitForEdge } from "../types/wfg";



/**
 * function to render the wait-for graph
 * @param param0 edges, positions
 * @returns the rendered WFG component
 */
export default function WfgGraph({
    edges,
    positions
}: {
    edges: WaitForEdge[],
    positions: WfgNodePosition[]
}) {

    const visibleNodes = new Set<ProcessId>();
    edges.forEach((edge) => {
        visibleNodes.add(edge.from);
        visibleNodes.add(edge.to);
    });


    if (edges.length === 0) {
        visibleNodes.add("P1");
    }

    return (
        <svg width={300} height={250} style={{ background: "#111", borderRadius: 12 }}>
            <defs>
                <marker
                    id="wfg-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                >
                    <polygon points="0 0, 8 4, 0 8" fill="#ffffff" />
                </marker>
            </defs>

            {edges.map((edge, index) => {
                const from = getWfgNodePos(edge.from, positions);
                const to = getWfgNodePos(edge.to, positions)

                const { x2, y2 } = shortenLine(
                    from.x,
                    from.y,
                    to.x,
                    to.y,
                    "process");

                return (
                    <line
                        key={index}
                        x1={from.x}
                        y1={from.y}
                        x2={x2}
                        y2={y2}
                        stroke="#4b9fff"
                        strokeWidth={3}
                        markerEnd="url(#wfg-arrow)"
                    />
                );
            })}


            {positions.map((node) => {
                if (!visibleNodes.has(node.id)) {
                    return null;
                }
                return (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={18}
                            fill="#222"
                            stroke="#a0ffae"
                            strokeWidth={2}
                        />
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
                );
            })}
        </svg>
    );
}