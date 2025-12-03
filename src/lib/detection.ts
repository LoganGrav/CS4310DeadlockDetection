import type { DetectionStep } from "../types/detection";
import type { ProcessId } from "../types/graphIds";
import type { WaitForGraph, WaitForEdge } from "../types/wfg";


/**
 * analyzes the given Wait-For Graph (WFG) to identify deadlocks
 * @param wfg the graph to analyze
 * @returns steps taken during deadlock detection
 */
export function detectDeadlockSteps(wfg: WaitForGraph): DetectionStep[] {
    const steps: DetectionStep[] = [];

    const adjacent: Record<ProcessId, ProcessId[]> = {} as Record<
        ProcessId,
        ProcessId[]
    >;

    // build adjacency list
    for (const proc of wfg.processes) {
        adjacent[proc] = [];
    }

    // populate edges
    for (const edge of wfg.edges) {
        adjacent[edge.from].push(edge.to);
    }

    const visited: ProcessId[] = [];
    const stack: ProcessId[] = [];
    let cycleFound = false;

    function isVisited(p: ProcessId): boolean {
        return visited.includes(p);
    }

    function isInStack(p: ProcessId): boolean {
        return stack.includes(p);
    }

    // depth- ffirst search to detect cycles
    function dfs(current: ProcessId): void {
        if (cycleFound) return;

        visited.push(current);
        stack.push(current);

        steps.push({
            description: `Visit ${current}`,
            visited: [...visited],
        });


        // explore neighbors
        const neighbors = adjacent[current];
        for (const next of neighbors) {
            if (cycleFound) break;

            const edge: WaitForEdge = { from: current, to: next };
            steps.push({
                description: `Explore edge ${current} -> ${next}`,
                visited: [...visited],
                edge,
            });

            if (!isVisited(next)) {
                dfs(next);
            } else if (isInStack(next)) {
                // cycle found
                const startIndex = stack.indexOf(next);
                const cyclePath = stack.slice(startIndex);
                cyclePath.push(next);

                steps.push({
                    description: `Cycle found: ${cyclePath.join(" -> ")}`,
                    visited: [...visited],
                    edge,
                    cycle: cyclePath,
                });

                cycleFound = true;
                break;
            }
        }

        stack.pop();
    }


    // initiate DFS from each unvisited process
    for (const proc of wfg.processes) {
        if (!isVisited(proc)) {
            dfs(proc);
            if (cycleFound) break;
        }
    }

    if (!cycleFound) {
        steps.push({
            description: "No cycle found - no deadlock.",
            visited: [...visited],
        });
    }

    return steps;
}
