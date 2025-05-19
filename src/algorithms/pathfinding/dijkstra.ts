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
    Dijkstra's algorithm finds the shortest path between nodes in a weighted graph. It works by maintaining 
    a set of unvisited nodes and continuously updating the shortest distance to each node from the starting point.
    
    The algorithm uses a priority queue to always process the node with the currently shortest known distance first, 
    making it efficient for finding optimal paths in weighted graphs.
  `,
  implementations: {
    javascript: `// JavaScript Implementation
function dijkstra(graph, start) {
  const distances = {};                    // Store shortest distances from start
  const pq = new PriorityQueue();         // Priority queue for efficient node selection
  const previous = {};                     // Store path information
  
  // Initialize distances
  for (let vertex in graph) {             // For each vertex in the graph
    distances[vertex] = Infinity;          // Set initial distance to Infinity
    previous[vertex] = null;              // No previous vertex in path yet
  }
  distances[start] = 0;                   // Distance to start is 0
  pq.enqueue(start, 0);                   // Add start to priority queue
  
  while (!pq.isEmpty()) {                 // While there are nodes to process
    const current = pq.dequeue();         // Get node with shortest distance
    
    for (let [neighbor, weight] of graph[current]) {  // For each neighbor
      const distance = distances[current] + weight;    // Calculate distance
      
      if (distance < distances[neighbor]) {           // If new distance is shorter
        distances[neighbor] = distance;               // Update distance
        previous[neighbor] = current;                 // Update path
        pq.enqueue(neighbor, distance);              // Add to priority queue
      }
    }
  }
  
  return { distances, previous };         // Return distances and path info
}`,
    python: `# Python Implementation
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}  # Initialize distances to infinity
    distances[start] = 0                                # Distance to start is 0
    pq = [(0, start)]                                  # Priority queue: (distance, node)
    previous = {node: None for node in graph}          # Store path information
    
    while pq:                                          # While there are nodes to process
        current_dist, current = heapq.heappop(pq)      # Get node with shortest distance
        
        if current_dist > distances[current]:          # Skip if we found better path
            continue
        
        for neighbor, weight in graph[current]:        # For each neighbor
            distance = current_dist + weight           # Calculate distance
            
            if distance < distances[neighbor]:         # If new distance is shorter
                distances[neighbor] = distance         # Update distance
                previous[neighbor] = current          # Update path
                heapq.heappush(pq, (distance, neighbor))  # Add to priority queue
    
    return distances, previous                        # Return distances and path info`
  }
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