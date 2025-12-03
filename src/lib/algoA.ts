import type { AlgoAState, AlgoAStep } from "../types/algorithmA";

/**
 * Example state for Algorithm A
 */
export const algoExample1: AlgoAState = {
    processes: ["P1", "P2", "P3", "P4"],
    resources: ["R1", "R2", "R3"],

    available: [1, 0, 1],

    allocation: [
        [0, 0, 1],
        [2, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
    ],

    request: [
        [0, 0, 1],
        [1, 0, 0],
        [1, 1, 2],
        [2, 2, 0],
    ],
};

// Implementation of Algorithm A
export function buildAlgoASteps(state: AlgoAState): AlgoAStep[] {
    const steps: AlgoAStep[] = [];

    const m = state.processes.length;
    const n = state.resources.length;

    const W = [...state.available];
    const marked: boolean[] = new Array(m).fill(false);

    // initialize
    steps.push({
        description: "Initialize: set W = V(t), mark all rows as unmarked.",
        W: [...W],
        marked: [...marked],
    });

    while (true) {
        let foundIndex = -1;

        // find unmarked Pi with Qi(t) <= W
        for (let i = 0; i < m; i++) {
            if (marked[i]) continue;

            let canSatisfy = true;
            for (let j = 0; j < n; j++) {
                if (state.request[i][j] > W[j]) {
                    canSatisfy = false;
                    break;
                }
            }

            if (canSatisfy) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex === -1) {
            
            steps.push({
                description:
                    "Terminate. Any unmarked process is deadlocked",
                W: [...W],
                marked: [...marked],
            });
            break;
        }

        // mark this row and add to W
        const i = foundIndex;

        for (let j = 0; j < n; j++) {
            W[j] += state.allocation[i][j];
        }
        marked[i] = true;

        steps.push({
            description: `Mark ${state.processes[i]} and set W = W + Allocation(${state.processes[i]}).`,
            W: [...W],
            marked: [...marked],
            chosenProcessIndex: i,
        });

        // loo back to step 2
    }

    return steps;
}

