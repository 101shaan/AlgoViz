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
    Breadth-First Search (BFS) is like exploring a maze level by level. Instead of going deep into one path, 
    it checks all nearby locations first before moving further away.

    Imagine you're standing in a room (let's call it the starting point). BFS first looks at all the doors 
    in that room. Then, for each door, it looks at all the rooms connected to those doors, and so on. 
    This way, you explore everything close to you before venturing further away.

    This makes BFS perfect for:
    - Finding the shortest path between two points
    - Exploring all possible moves in a game
    - Checking if two points are connected
    - Social network connections (finding friends of friends)
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
  
  // Initialize visited array and queue
  const visited = new Array(nodes.length).fill(false);
  const queue: number[] = [];
  const visitedNodes: string[] = [];
  const visitedEdges: { source: string; target: string }[] = [];
  
  animations.push({
    step: 0,
    highlightedLines: [1, 2, 3, 4],
    array: [],
    visitedNodes: [],
    visitedEdges: [],
    current: startId,
    message: `Start BFS from node ${startId}`,
  });
  
  // Initialize BFS
  visited[startIdx] = true;
  queue.push(startIdx);
  visitedNodes.push(nodes[startIdx].id);
  
  animations.push({
    step: animations.length,
    highlightedLines: [3, 4],
    array: [],
    visitedNodes: [...visitedNodes],
    visitedEdges: [...visitedEdges],
    current: nodes[startIdx].id,
    message: `Mark node ${nodes[startIdx].id} as discovered and add to queue`,
  });
  
  // Main BFS loop
  while (queue.length > 0) {
    animations.push({
      step: animations.length,
      highlightedLines: [5],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      current: nodes[queue[0]].id,
      message: `Queue: [${queue.map(idx => nodes[idx].id).join(', ')}]`,
    });
    
    const current = queue.shift()!;
    
    animations.push({
      step: animations.length,
      highlightedLines: [6],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      current: nodes[current].id,
      message: `Dequeue node ${nodes[current].id}`,
    });
    
    // Process all neighbors
    for (const neighbor of adjacencyList[current]) {
      animations.push({
        step: animations.length,
        highlightedLines: [7],
        array: [],
        visitedNodes: [...visitedNodes],
        visitedEdges: [...visitedEdges],
        current: nodes[current].id,
        comparing: [nodes[neighbor].id],
        message: `Check neighbor ${nodes[neighbor].id}`,
      });
      
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
        visitedNodes.push(nodes[neighbor].id);
        visitedEdges.push({
          source: nodes[current].id,
          target: nodes[neighbor].id
        });
        
        animations.push({
          step: animations.length,
          highlightedLines: [8, 9, 10],
          array: [],
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          current: nodes[current].id,
          comparing: [nodes[neighbor].id],
          message: `Mark node ${nodes[neighbor].id} as discovered and add to queue`,
        });
      } else {
        animations.push({
          step: animations.length,
          highlightedLines: [8],
          array: [],
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          current: nodes[current].id,
          comparing: [nodes[neighbor].id],
          message: `Node ${nodes[neighbor].id} already discovered, skip`,
        });
      }
    }
  }
  
  animations.push({
    step: animations.length,
    highlightedLines: [1, 10],
    array: [],
    visitedNodes: [...visitedNodes],
    visitedEdges: [...visitedEdges],
    message: `BFS complete. Visit order: ${visitedNodes.join(' -> ')}`,
    complete: true,
  });
  
  return animations;
}