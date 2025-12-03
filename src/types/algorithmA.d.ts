import type { ProcessId, ResourceId } from "./graphIds";

export interface AlgoAState {
  processes: ProcessId[];      
  resources: ResourceId[];     
  available: number[];         
  allocation: number[][];     
  request: number[][];        
}

export interface AlgoAStep {
  description: string;
  W: number[];                 
  marked: boolean[];           
  chosenProcessIndex?: number; 
}
