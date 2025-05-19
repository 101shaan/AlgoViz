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
    Think of Dijkstra's algorithm like planning a road trip. You want to find the shortest route from your 
    starting point to your destination, considering the distance between each city (or point) along the way.

    Here's how it works:
    1. Start at your beginning point
    2. Look at all the directly connected points and their distances
    3. Always move to the closest unvisited point
    4. Keep track of the total distance to reach each point
    5. Update the routes if you find a shorter path

    It's like having a GPS that constantly updates to find the quickest route to your destination!

    Real-world uses include:
    - Navigation systems finding the fastest route
    - Network routing (finding the fastest path for data)
    - Games (pathfinding for characters)
    - Social networks (finding shortest connection between users)
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
  
  // Initialize distances and previous nodes
  const distances = new Array(nodes.length).fill(Infinity);
  const previous = new Array(nodes.length).fill(null);
  const visited = new Array(nodes.length).fill(false);
  const visitedNodes: string[] = [];
  const visitedEdges: { source: string; target: string }[] = [];
  const pathNodes: string[] = [];
  const pathEdges: { source: string; target: string }[] = [];
  
  distances[startIdx] = 0;
  visitedNodes.push(startId);
  
  animations.push({
    step: 0,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7],
    array: [],
    visitedNodes: [...visitedNodes],
    visitedEdges: [...visitedEdges],
    pathNodes: [...pathNodes],
    pathEdges: [...pathEdges],
    current: startId,
    message: `Initialize Dijkstra's algorithm from node ${startId}`,
  });
  
  // Main algorithm
  for (let i = 0; i < nodes.length; i++) {
    animations.push({
      step: animations.length,
      highlightedLines: [9],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      pathNodes: [...pathNodes],
      pathEdges: [...pathEdges],
      current: startId,
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
    
    const currentNode = nodes[minIndex];
    visited[minIndex] = true;
    visitedNodes.push(currentNode.id);
    
    animations.push({
      step: animations.length,
      highlightedLines: [10, 11],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      pathNodes: [...pathNodes],
      pathEdges: [...pathEdges],
      current: currentNode.id,
      message: `Selected node ${currentNode.id} with distance ${distances[minIndex]}`,
    });
    
    // Check all neighbors of the current node
    const neighbors = edges
      .filter(edge => edge.source === currentNode.id || edge.target === currentNode.id)
      .map(edge => ({
        node: edge.source === currentNode.id ? edge.target : edge.source,
        weight: edge.weight
      }));
    
    for (const { node: neighborId, weight } of neighbors) {
      const neighborIdx = nodeMap.get(neighborId)!;
      if (visited[neighborIdx]) continue;
      
      visitedEdges.push({ source: currentNode.id, target: neighborId });
      
      animations.push({
        step: animations.length,
        highlightedLines: [13],
        array: [],
        visitedNodes: [...visitedNodes],
        visitedEdges: [...visitedEdges],
        pathNodes: [...pathNodes],
        pathEdges: [...pathEdges],
        current: currentNode.id,
        comparing: [neighborId],
        message: `Checking neighbor ${neighborId}`,
      });
      
      const alt = distances[minIndex] + weight;
      
      animations.push({
        step: animations.length,
        highlightedLines: [14],
        array: [],
        visitedNodes: [...visitedNodes],
        visitedEdges: [...visitedEdges],
        pathNodes: [...pathNodes],
        pathEdges: [...pathEdges],
        current: currentNode.id,
        comparing: [neighborId],
        message: `Current distance to ${neighborId}: ${distances[neighborIdx] === Infinity ? '∞' : distances[neighborIdx]}. New potential distance: ${alt}`,
      });
      
      if (alt < distances[neighborIdx]) {
        animations.push({
          step: animations.length,
          highlightedLines: [15, 16],
          array: [],
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          pathNodes: [...pathNodes],
          pathEdges: [...pathEdges],
          current: currentNode.id,
          comparing: [neighborId],
          message: `Update distance to ${neighborId} from ${distances[neighborIdx] === Infinity ? '∞' : distances[neighborIdx]} to ${alt}`,
        });
        
        distances[neighborIdx] = alt;
        previous[neighborIdx] = minIndex;
      }
    }
  }
  
  // Reconstruct the path
  let current = endIdx;
  
  if (previous[current] !== null || current === startIdx) {
    while (current !== null) {
      const currentNodeId = nodes[current].id;
      pathNodes.unshift(currentNodeId);
      
      if (previous[current] !== null) {
        const prevNodeId = nodes[previous[current]].id;
        pathEdges.unshift({
          source: prevNodeId,
          target: currentNodeId
        });
      }
      
      current = previous[current];
    }
    
    animations.push({
      step: animations.length,
      highlightedLines: [18],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      pathNodes: [...pathNodes],
      pathEdges: [...pathEdges],
      message: `Found shortest path: ${pathNodes.join(' -> ')}`,
      complete: true,
    });
  } else {
    animations.push({
      step: animations.length,
      highlightedLines: [18],
      array: [],
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      pathNodes: [...pathNodes],
      pathEdges: [...pathEdges],
      message: `No path found from ${startId} to ${endId}`,
      complete: true,
    });
  }
  
  return animations;
}