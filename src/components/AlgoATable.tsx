import type { AlgoAState, AlgoAStep } from "../types/algorithmA";
interface AlgoATableProps {
  state: AlgoAState;
  step: AlgoAStep;
}

/**
 * function to render the table for Algorithm A
 * @param param0 the state and step of the algorithm
 * @returns rendered table component
 */
export default function AlgoATable({ state, step }: AlgoATableProps) {
  const { processes, resources, allocation, request } = state;
  const { W, marked, chosenProcessIndex } = step;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl">
        <span className="font-semibold">W = </span>
        [
        {W.map((v, i) => (
          <span key={i}>
            {v}
            {i < W.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </div>

      <table className="text-4xl border-separate border-spacing-x-4 border-spacing-y-1">
        <thead>
          <tr>
            <th></th>
            {resources.map((r) => (
              <th key={r}>{r}</th>
            ))}
            <th></th>
            {resources.map((r) => (
              <th key={r}>{r}</th>
            ))}
          </tr>
          <tr>
            <th>Pi</th>
            <th colSpan={resources.length}>Allocation</th>
            <th></th>
            <th colSpan={resources.length}>Request</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => {
            const isMarked = marked[i];
            const isChosen = chosenProcessIndex === i;

            return (
              <tr
                key={p}
                className={
                  isChosen
                    ? "bg-[#33112e]"
                    : isMarked
                    ? "bg-[#112c1e]"
                    : "bg-transparent"
                }
              >
                <td className="pr-2">{p}</td>
                {allocation[i].map((val, j) => (
                  <td key={`a-${i}-${j}`} className="px-1 text-center">
                    {val}
                  </td>
                ))}
                <td className="px-2">|</td>
                {request[i].map((val, j) => (
                  <td key={`q-${i}-${j}`} className="px-1 text-center">
                    {val}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
