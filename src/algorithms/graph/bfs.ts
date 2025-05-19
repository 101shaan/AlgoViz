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
  implementations: {
    javascript: `// JavaScript Implementation
function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // Get all neighbors of current node
    const neighbors = graph[current] || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visited;
}`,
    python: `# Python Implementation
from collections import deque

def bfs(graph, start_node):
    visited = set()
    queue = deque([start_node])
    visited.add(start_node)
    
    while queue:
        current = queue.popleft()
        
        # Get all neighbors of current node
        neighbors = graph.get(current, [])
        
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return visited`
  }
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
    highlightedLines: [2, 3, 4],
    array: [],
    visitedNodes: [],
    visitedEdges: [],
    current: startId,
    message: `Start BFS from node ${startId}`,
    queue: [] // Add queue visualization
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
    queue: queue.map(idx => nodes[idx].id) // Show queue contents
  });
  
  // Main BFS loop
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    animations.push({
      step: animations.length,
      highlightedLines: [7],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      current: nodes[current].id,
      message: `Dequeue node ${nodes[current].id}`,
      queue: queue.map(idx => nodes[idx].id)
    });
    
    // Process all neighbors
    for (const neighbor of adjacencyList[current]) {
      if (!visited[neighbor]) {
        animations.push({
          step: animations.length,
          highlightedLines: [12, 13],
          array: [],
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          current: nodes[current].id,
          comparing: [nodes[neighbor].id],
          message: `Check unvisited neighbor ${nodes[neighbor].id}`,
          queue: queue.map(idx => nodes[idx].id)
        });
        
        visited[neighbor] = true;
        queue.push(neighbor);
        visitedNodes.push(nodes[neighbor].id);
        visitedEdges.push({
          source: nodes[current].id,
          target: nodes[neighbor].id
        });
        
        animations.push({
          step: animations.length,
          highlightedLines: [14, 15],
          array: [],
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          current: nodes[current].id,
          comparing: [nodes[neighbor].id],
          message: `Mark node ${nodes[neighbor].id} as discovered and add to queue`,
          queue: [...queue.map(idx => nodes[idx].id), nodes[neighbor].id]
        });
      }
    }
  }
  
  animations.push({
    step: animations.length,
    highlightedLines: [19],
    array: [],
    visitedNodes: [...visitedNodes],
    visitedEdges: [...visitedEdges],
    message: `BFS complete. Visit order: ${visitedNodes.join(' -> ')}`,
    queue: [],
    complete: true
  });
  
  return animations;
}