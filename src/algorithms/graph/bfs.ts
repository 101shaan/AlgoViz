import { AnimationStep, Graph } from '../../types';

export const bfsInfo = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'graph',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
  stable: true,
  description: `
    Breadth-First Search (BFS) is a graph traversal algorithm that explores all the vertices of a graph at the present 
    depth before moving on to vertices at the next depth level. This makes BFS particularly useful for finding the 
    shortest path on unweighted graphs.
    
    BFS uses a queue data structure to keep track of vertices to visit next. It starts at a specific vertex (the "source"), 
    visits all of its neighbors, then visits the neighbors of those neighbors, and so on, until all reachable vertices 
    have been visited.
    
    BFS is widely used in networking, web crawlers, finding connected components, and solving puzzles like the shortest 
    path in a maze.
  `,
  pseudocode: [
    'procedure BFS(G, startVertex):',
    '    let Q be a queue',
    '    label startVertex as discovered',
    '    Q.enqueue(startVertex)',
    '    while Q is not empty:',
    '        v := Q.dequeue()',
    '        for all edges from v to w in G.adjacencyList[v] do:',
    '            if w is not labeled as discovered:',
    '                label w as discovered',
    '                Q.enqueue(w)',
  ],
};

export function generateBFSSteps(graph: Graph, startId: string): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const { nodes, edges } = graph;
  
  // Map node IDs to indexes for easier processing
  const nodeMap = new Map<string, number>();
  nodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
  });
  
  const startIdx = nodeMap.get(startId)!;
  
  // Create adjacency list from edges
  const adjacencyList: { [key: number]: number[] } = {};
  nodes.forEach((_, index) => {
    adjacencyList[index] = [];
  });
  
  edges.forEach(edge => {
    const sourceIdx = nodeMap.get(edge.source)!;
    const targetIdx = nodeMap.get(edge.target)!;
    adjacencyList[sourceIdx].push(targetIdx);
    adjacencyList[targetIdx].push(sourceIdx); // For undirected graphs
  });
  
  // Initialize visited array
  const visited = new Array(nodes.length).fill(false);
  const queue: number[] = [];
  const visitOrder: number[] = [];
  
  animations.push({
    step: 0,
    highlightedLines: [1, 2, 3, 4],
    array: [],
    message: `Start BFS from node ${startId}`,
  });
  
  // Initialize BFS
  visited[startIdx] = true;
  queue.push(startIdx);
  
  animations.push({
    step: animations.length,
    highlightedLines: [3, 4],
    array: [],
    current: startIdx,
    message: `Mark node ${nodes[startIdx].id} as discovered and add to queue`,
  });
  
  // Main BFS loop
  while (queue.length > 0) {
    animations.push({
      step: animations.length,
      highlightedLines: [5],
      array: [],
      message: `Queue: [${queue.map(idx => nodes[idx].id).join(', ')}]`,
    });
    
    const current = queue.shift()!;
    visitOrder.push(current);
    
    animations.push({
      step: animations.length,
      highlightedLines: [6],
      array: [],
      current: current,
      message: `Dequeue node ${nodes[current].id}`,
    });
    
    // Process all neighbors
    for (const neighbor of adjacencyList[current]) {
      animations.push({
        step: animations.length,
        highlightedLines: [7],
        array: [],
        current: current,
        comparing: [neighbor],
        message: `Check neighbor ${nodes[neighbor].id}`,
      });
      
      if (!visited[neighbor]) {
        animations.push({
          step: animations.length,
          highlightedLines: [8, 9, 10],
          array: [],
          current: current,
          comparing: [neighbor],
          message: `Mark node ${nodes[neighbor].id} as discovered and add to queue`,
        });
        
        visited[neighbor] = true;
        queue.push(neighbor);
      } else {
        animations.push({
          step: animations.length,
          highlightedLines: [8],
          array: [],
          current: current,
          comparing: [neighbor],
          message: `Node ${nodes[neighbor].id} already discovered, skip`,
        });
      }
    }
  }
  
  animations.push({
    step: animations.length,
    highlightedLines: [1, 10],
    array: [],
    message: `BFS complete. Visit order: ${visitOrder.map(idx => nodes[idx].id).join(' -> ')}`,
    complete: true,
  });
  
  return animations;
}