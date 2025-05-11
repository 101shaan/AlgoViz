import { AnimationStep, Graph, Node, Edge } from '../../types';

export const dijkstraInfo = {
  id: 'dijkstra',
  name: 'Dijkstra\'s Algorithm',
  category: 'pathfinding',
  timeComplexity: {
    best: 'O(E + V log V)',
    average: 'O(E + V log V)',
    worst: 'O(E + V log V)',
  },
  spaceComplexity: 'O(V)',
  stable: true,
  description: `
    Dijkstra's algorithm is a popular algorithm for finding the shortest paths between nodes in a graph, 
    which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956.
    
    The algorithm exists in many variants. Dijkstra's original algorithm found the shortest path between two given nodes, 
    but a more common variant fixes a single node as the "source" node and finds shortest paths from the source to all 
    other nodes, producing a shortest-path tree.
    
    Dijkstra's algorithm uses a priority queue to greedily select the closest vertex that has not yet been processed, 
    and performs a relaxation operation to potentially improve the shortest path found so far between the source and each destination.
  `,
  pseudocode: [
    'function Dijkstra(Graph, source):',
    '    create vertex set Q',
    '    for each vertex v in Graph:',
    '        dist[v] := INFINITY',
    '        prev[v] := UNDEFINED',
    '        add v to Q',
    '    dist[source] := 0',
    '',
    '    while Q is not empty:',
    '        u := vertex in Q with min dist[u]',
    '        remove u from Q',
    '        ',
    '        for each neighbor v of u:',
    '            alt := dist[u] + length(u, v)',
    '            if alt < dist[v]:',
    '                dist[v] := alt',
    '                prev[v] := u',
    '',
    '    return dist[], prev[]',
  ],
};

export function generateDijkstraSteps(graph: Graph, startId: string, endId: string): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const { nodes, edges } = graph;
  
  // Map node IDs to indexes for easier processing
  const nodeMap = new Map<string, number>();
  nodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
  });
  
  const startIdx = nodeMap.get(startId)!;
  const endIdx = nodeMap.get(endId)!;
  
  // Create adjacency list from edges
  const adjacencyList: { [key: number]: { node: number; weight: number }[] } = {};
  nodes.forEach((_, index) => {
    adjacencyList[index] = [];
  });
  
  edges.forEach(edge => {
    const sourceIdx = nodeMap.get(edge.source)!;
    const targetIdx = nodeMap.get(edge.target)!;
    adjacencyList[sourceIdx].push({ node: targetIdx, weight: edge.weight });
    adjacencyList[targetIdx].push({ node: sourceIdx, weight: edge.weight }); // For undirected graphs
  });
  
  // Initialize distances and previous nodes
  const distances = new Array(nodes.length).fill(Infinity);
  const previous = new Array(nodes.length).fill(null);
  const visited = new Array(nodes.length).fill(false);
  
  distances[startIdx] = 0;
  
  animations.push({
    step: 0,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7],
    array: [],
    message: `Initialize Dijkstra's algorithm from node ${startId}`,
  });
  
  // Main algorithm
  for (let i = 0; i < nodes.length; i++) {
    animations.push({
      step: animations.length,
      highlightedLines: [9],
      array: [],
      message: 'Finding the unvisited node with the smallest distance',
    });
    
    // Find the unvisited node with the smallest distance
    let minDistance = Infinity;
    let minIndex = -1;
    
    for (let j = 0; j < nodes.length; j++) {
      if (!visited[j] && distances[j] < minDistance) {
        minDistance = distances[j];
        minIndex = j;
      }
    }
    
    if (minIndex === -1 || minIndex === endIdx) {
      break;
    }
    
    visited[minIndex] = true;
    
    animations.push({
      step: animations.length,
      highlightedLines: [10, 11],
      array: [],
      current: minIndex,
      message: `Selected node ${nodes[minIndex].id} with distance ${distances[minIndex]}`,
    });
    
    // Check all neighbors of the current node
    for (const { node: neighborIdx, weight } of adjacencyList[minIndex]) {
      if (visited[neighborIdx]) continue;
      
      animations.push({
        step: animations.length,
        highlightedLines: [13],
        array: [],
        current: minIndex,
        comparing: [neighborIdx],
        message: `Checking neighbor ${nodes[neighborIdx].id}`,
      });
      
      const alt = distances[minIndex] + weight;
      
      animations.push({
        step: animations.length,
        highlightedLines: [14],
        array: [],
        current: minIndex,
        comparing: [neighborIdx],
        message: `Current distance to ${nodes[neighborIdx].id}: ${distances[neighborIdx] === Infinity ? '∞' : distances[neighborIdx]}. New potential distance: ${alt}`,
      });
      
      if (alt < distances[neighborIdx]) {
        animations.push({
          step: animations.length,
          highlightedLines: [15, 16],
          array: [],
          current: minIndex,
          comparing: [neighborIdx],
          message: `Update distance to ${nodes[neighborIdx].id} from ${distances[neighborIdx] === Infinity ? '∞' : distances[neighborIdx]} to ${alt}`,
        });
        
        distances[neighborIdx] = alt;
        previous[neighborIdx] = minIndex;
      }
    }
  }
  
  // Reconstruct the path
  const path = [];
  let current = endIdx;
  
  if (previous[current] !== null || current === startIdx) {
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    animations.push({
      step: animations.length,
      highlightedLines: [18],
      array: [],
      message: `Found shortest path: ${path.map(idx => nodes[idx].id).join(' -> ')}`,
      complete: true,
    });
  } else {
    animations.push({
      step: animations.length,
      highlightedLines: [18],
      array: [],
      message: `No path found from ${startId} to ${endId}`,
      complete: true,
    });
  }
  
  return animations;
}