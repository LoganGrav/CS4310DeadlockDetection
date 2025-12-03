import { useState } from 'react'
import './App.css'
import RagGraph from './components/RagGraph';
import WfgGraph from './components/WfgGraph';
import DetectionWfgGraph from './components/DetectionGraph';
import { buildWaitForGraph, buildWfgSteps, wfgNodePositions, wfgNodePositions2 } from "./lib/wfg";
import { detectDeadlockSteps } from "./lib/detection";
import { ragExample, ragExample2, ragNodePositions, ragNodePositions2 } from "./lib/rag";
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { Card } from './components/ui/card';
import AlgoATable from './components/AlgoATable';
import { algoExample1, buildAlgoASteps } from './lib/algoA';

const wfg1 = buildWaitForGraph(ragExample);
const wfgSteps1 = buildWfgSteps(wfg1);
const detectionSteps1 = detectDeadlockSteps(wfg1);

const wfg2 = buildWaitForGraph(ragExample2);
const wfgSteps2 = buildWfgSteps(wfg2);
const detectionSteps2 = detectDeadlockSteps(wfg2);

type ExampleIndex = 0 | 1 | 2;

const algoSteps1 = buildAlgoASteps(algoExample1);

function App() {
  const [activeExample, setActiveExample] = useState<ExampleIndex>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [detectStepIndex, setDetectStepIndex] = useState<number>(0);
  const [algoIndex, setAlgoIndex] = useState(0);
  const algoStep = algoSteps1[algoIndex];


  const isFirst = activeExample === 0;

  const wfg = isFirst ? wfg1 : wfg2;
  const wfgSteps = isFirst ? wfgSteps1 : wfgSteps2;
  const detectionSteps = isFirst ? detectionSteps1 : detectionSteps2;

  const currentStep = wfgSteps[currentStepIndex];
  const detectStep = detectionSteps[detectStepIndex];

  const wfgPositions = isFirst ? wfgNodePositions : wfgNodePositions2;

  const wfgDone = currentStepIndex === wfgSteps.length - 1;

  /**
   * Navigate to the next step in the wait-for graph construction.
   */
  const goNext = () => {
    setCurrentStepIndex((prev) =>
      prev < wfgSteps.length - 1 ? prev + 1 : prev
    );

  };

  /**
   * Navigate to the previous step in the wait-for graph construction.
   */
  const goPrev = () => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));

  };

  // Reset the wait-for graph construction 
  const reset = () => setCurrentStepIndex(0);

  /**
   * Navigate to the next step in the deadlock detection process
   */
  const nextDetect = () => {
    setDetectStepIndex((prev) =>
      prev < detectionSteps.length - 1 ? prev + 1 : prev
    );
  };

  /**
   * Navigate to the previous step in the deadlock detection process
   */
  const prevDetect = () => {
    setDetectStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Reset the deadlock detection process
  const resetDetect = () => setDetectStepIndex(0);

  /**
   * switches the active example
   * @param index 
   */
  const switchExample = (index: ExampleIndex) => {
    setActiveExample(index);
    setCurrentStepIndex(0);
    setDetectStepIndex(0);
    setAlgoIndex(0);
  };


  const tabValue =
    activeExample === 0 ? "example-1" :
      activeExample === 1 ? "example-2" :
        "example-3";

  // main render
  return (
    // page container
    <div className="w-svw min-h-svh flex items-center justify-center gap-10 p-8">
      {/* main wrapper */}
      <div className='!h-[90%]'>
      <Tabs value={tabValue}
        onValueChange={(val) => {
          if (val === "example-1") switchExample(0);
          else if (val === "example-2") switchExample(1);
          else switchExample(2);
        }}

      >
        <TabsList>
          <TabsTrigger value='example-1'>Example 1</TabsTrigger>
          <TabsTrigger value='example-2'>Example 2</TabsTrigger>
          <TabsTrigger value='example-3'>Example 3</TabsTrigger>
        </TabsList>
        <TabsContent value='example-1'>
          <div className='flex flex-col items-center justify-center gap-10 h-full w-full'>
            <Card className=''>
              {/* resource allocations graph */}
              <div className="flex flex-col items-center gap-4">
                <h2 className='font-bold'>Resource-Allocation Graph</h2>
                <RagGraph graph={ragExample} positions={ragNodePositions} />
                <p className="text-sm text-gray-300 text-center">
                  circles are processes, squares are resources. <br /> blue edges = allocated, yellow edges = requests.
                </p>
              </div>
              <div className='flex items-center justify-center grow'>


                {/* wait-for graph */}
                <div className="flex flex-col items-center w-1/2 gap-4 h-full">

                  <h1 className='font-bold text-center'>Wait-For Graph Construction</h1>
                  <WfgGraph edges={currentStep.edges} positions={wfgPositions} />
                  <h3>
                    Step {currentStepIndex + 1}{": "}
                    {currentStep.description}
                  </h3>

                  <div className="min-h-[145px] flex items-start justify-center overflow-y-hidden">
                    <ul className="space-y-1">
                      {currentStep.edges.map((edge, edgeIndex) => (
                        <li key={edgeIndex}>
                          {edge.from} {"->"} {edge.to}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <button onClick={goPrev} disabled={currentStepIndex === 0}>
                      Previous
                    </button>
                    <button
                      onClick={goNext}
                      disabled={currentStepIndex === wfgSteps.length - 1}
                    >
                      Next
                    </button>
                    <button onClick={reset}>Reset</button>
                  </div>
                </div>

                {/* deadlock detection */}
                <div className="flex flex-col items-center w-1/2 h-full gap-4" >
                  <h1 className='font-bold text-center'>Deadlock Detection</h1>

                  <span style={{ display: !wfgDone ? 'none' : '' }}>
                    <DetectionWfgGraph step={detectStep} wfg={wfg} positions={wfgPositions} />
                  </span>
                  <span style={{ display: wfgDone ? 'none' : '' }}>
                    <div className='w-[300px] h-[250px] bg-[#111111] rounded-xl'>

                    </div>
                  </span>

                  <h3>
                    Step {detectStepIndex + 1}{": "}
                    {detectStep.description}
                  </h3>

                  <div className="min-h-[145px] flex items-start justify-center overflow-y-hidden">
                    <ul>
                      <li>
                        Visited processes:{" "}
                        {detectStep.visited.length > 0
                          ? detectStep.visited.join(", ")
                          : "none"}
                      </li>
                      {detectStep.edge && (
                        <li>
                          Exploring edge: {detectStep.edge.from} {'->'} {detectStep.edge.to}
                        </li>
                      )}
                      {detectStep.cycle && (
                        <li>
                          Cycle: {detectStep.cycle.join(" -> ")}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <button onClick={prevDetect} disabled={detectStepIndex === 0 || !wfgDone}>
                      Previous
                    </button>
                    <button
                      onClick={nextDetect}
                      disabled={detectStepIndex === detectionSteps.length - 1 || !wfgDone}
                    >
                      Next
                    </button>
                    <button onClick={resetDetect}>Reset</button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='example-2'>
          <div className='flex flex-col items-center justify-center gap-10 h-full w-full'>
            <Card>
              {/* resource allocations graph */}
              <div className="flex flex-col items-center gap-4">
                <h2 className='font-bold'>Resource-Allocation Graph</h2>
                <RagGraph graph={ragExample2} positions={ragNodePositions2} />
                <p className="text-sm text-gray-300 text-center">

                  circles are processes, squares are resources. <br /> blue edges = allocated, yellow edges = requests.
                </p>
              </div>
              <div className='flex items-center justify-center grow-1'>


                {/* wait-for graph */}
                <div className="flex flex-col items-center w-1/2 gap-4 h-full">

                  <h1 className='font-bold text-center'>Wait-For Graph Construction</h1>
                  <WfgGraph edges={currentStep.edges} positions={wfgPositions} />
                  <h3>
                    Step {currentStepIndex + 1}{": "}
                    {currentStep.description}
                  </h3>
                  <div className="min-h-[145px] flex items-start justify-center overflow-y-hidden">

                    <ul>
                      {currentStep.edges.map((edge, edgeIndex) => (
                        <li key={edgeIndex}>
                          {edge.from} {'->'} {edge.to}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <button onClick={goPrev} disabled={currentStepIndex === 0}>
                      Previous
                    </button>
                    <button
                      onClick={goNext}
                      disabled={currentStepIndex === wfgSteps.length - 1}
                    >
                      Next
                    </button>
                    <button onClick={reset}>Reset</button>
                  </div>
                </div>

                {/* deadlock detection */}
                <div className="flex flex-col items-center w-1/2 h-full gap-4 grow-1" >
                  <h1 className='font-bold text-center'>Deadlock Detection</h1>

                  <span style={{ display: !wfgDone ? 'none' : '' }}>
                    <DetectionWfgGraph step={detectStep} wfg={wfg} positions={wfgPositions} />
                  </span>
                  <span style={{ display: wfgDone ? 'none' : '' }}>
                    <div className='w-[300px] h-[250px] bg-[#111111] rounded-xl'>

                    </div>
                  </span>

                  <h3>
                    Step {detectStepIndex + 1}{": "}
                    {detectStep.description}
                  </h3>
                  <div className="min-h-[145px] flex items-start justify-center overflow-y-hidden">
                    <ul>
                      <li>
                        Visited processes:{" "}
                        {detectStep.visited.length > 0
                          ? detectStep.visited.join(", ")
                          : "none"}
                      </li>
                      {detectStep.edge && (
                        <li>
                          Exploring edge: {detectStep.edge.from} {'->'} {detectStep.edge.to}
                        </li>
                      )}
                      {detectStep.cycle && (
                        <li>
                          Cycle: {detectStep.cycle.join(" -> ")}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className='flex gap-2 mt-1'>
                    <button onClick={prevDetect} disabled={detectStepIndex === 0 || !wfgDone}>
                      Previous
                    </button>
                    <button
                      onClick={nextDetect}
                      disabled={detectStepIndex === detectionSteps.length - 1 || !wfgDone}
                    >
                      Next
                    </button>
                    <button onClick={resetDetect}>Reset</button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </TabsContent>
        <TabsContent value='example-3'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <Card className='p-6 flex flex-col items-center gap-4 h-full w-full min-h-[1097.15px] min-w-[1284.82px] justify-center'>
              <div className='flex grow'>

                <h1 className='font-bold text-center'>
                  Algorithm A (Multiple-Instance Detection)
                </h1>
              </div>

              <div className='flex grow'>
                <AlgoATable state={algoExample1} step={algoStep} />
              </div>
              <h3>
                Step {algoIndex + 1} of {algoSteps1.length}:{" "}
                {algoStep.description}
              </h3>

              <div className='flex gap-2 mt-1'>
                <button
                  onClick={() => setAlgoIndex((i) => (i > 0 ? i - 1 : i))}
                  disabled={algoIndex === 0}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setAlgoIndex((i) =>
                      i < algoSteps1.length - 1 ? i + 1 : i
                    )
                  }
                  disabled={algoIndex === algoSteps1.length - 1}
                >
                  Next
                </button>
                <button onClick={() => setAlgoIndex(0)}>Reset</button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

</div>

    </div>
  );
}


export default App
