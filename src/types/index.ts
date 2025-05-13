// Algorithm Types
export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  description: string;
  pseudocode: string[];
}

export type AlgorithmCategory = 'sorting' | 'searching' | 'pathfinding' | 'graph';

// Animation Types
export interface AnimationStep {
  step: number;
  highlightedLines: number[];
  array?: number[];
  current?: string;
  comparing?: string[];
  swapping?: number[];
  message: string;
  complete?: boolean;
  visitedNodes?: string[];
  visitedEdges?: { source: string; target: string }[];
  pathNodes?: string[];
  pathEdges?: { source: string; target: string }[];
}

export interface ArrayItem {
  value: number;
  status: 'default' | 'current' | 'comparing' | 'sorted' | 'swapping';
}

// Graph Types
export interface Node {
  id: string;
  x: number;
  y: number;
  status: 'default' | 'start' | 'end' | 'visited' | 'current' | 'path';
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  status: 'default' | 'visited' | 'path';
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

// Pseudocode Types
export interface PseudocodeStep {
  line: number;
  code: string;
  indent: number;
}