import { shortenLine } from "../lib/shorten-line";
import { getWfgNodePos, type WfgNodePosition } from "../lib/wfg";
import type { DetectionStep } from "../types/detection";
import type { ProcessId } from "../types/graphIds";
import type { WaitForGraph } from "../types/wfg";


interface DetectionGraphProps {
    step: DetectionStep;
    wfg: WaitForGraph;
    positions: WfgNodePosition[];
}


/**
 * function to render the wait-for graph for deadlock detection
 * @param param0 step, wfg, positions
 * @returns the rendered detection graph component
 */
export default function DetectionWfgGraph({
    step,
    wfg,
    positions,
}: DetectionGraphProps) {

    const isDeadlock = !!step.cycle && step.cycle.length > 0;
    const noDeadlock =
        !isDeadlock && step.description.includes("No cycle found");
    const visitedSet = new Set<ProcessId>(step.visited ?? []);


    const currentEdge = step.edge;

    return (
        <svg width={300} height={250} style={{ background: "#111", borderRadius: 12 }}>
            <defs>
                <marker
                    id="detect-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                >
                    <polygon points="0 0, 8 4, 0 8" fill="#ffffff" />
                </marker>
            </defs>


            {wfg.edges.map((edge, index) => {
                const from = getWfgNodePos(edge.from, positions);
                const to = getWfgNodePos(edge.to, positions);

                const { x2, y2 } = shortenLine(
                    from.x,
                    from.y,
                    to.x,
                    to.y,
                    "process");

                let stroke = "#4b9fff";
                let strokeWidth = 2;


                if (isDeadlock) {
                    stroke = "#ff1744";
                    strokeWidth = 3;
                } else if (noDeadlock) {
                    stroke = "#42ffca";
                    strokeWidth = 3;
                } else if (
                    currentEdge &&
                    currentEdge.from === edge.from &&
                    currentEdge.to === edge.to
                ) {
                    stroke = "#ff9800";
                    strokeWidth = 3;
                }

                return (
                    <line
                        key={index}
                        x1={from.x}
                        y1={from.y}
                        x2={x2}
                        y2={y2}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        markerEnd="url(#detect-arrow)"
                    />
                );
            })}

            {wfg.processes.map((pid) => {
                const node = getWfgNodePos(pid, positions);
                const isVisited = visitedSet.has(pid);

                let stroke = "#a0ffae";
                let fill = "#222";

                if (isDeadlock) {
                    stroke = "#ff1744";
                    fill = "#3b000f";
                } else if (noDeadlock) {
                    stroke = "#42ffca";
                    fill = "#0d2926";
                } else if (isVisited) {
                    stroke = "#ff4fd8";
                    fill = "#33112e";
                }

                return (
                    <g key={pid}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={18}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={3}
                        />
                        <text
                            x={node.x}
                            y={node.y + 4}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#ffffff"
                        >
                            {pid}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}


