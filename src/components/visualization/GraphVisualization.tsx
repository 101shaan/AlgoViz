import React, { useRef, useEffect } from 'react';
import { Graph, Node, Edge } from '../../types';

interface GraphVisualizationProps {
  graph: Graph;
  startId?: string;
  endId?: string;
  currentId?: string;
  visitedNodes?: string[];
  visitedEdges?: { source: string; target: string }[];
  pathNodes?: string[];
  pathEdges?: { source: string; target: string }[];
  animationSpeed?: number;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graph,
  startId,
  endId,
  currentId,
  visitedNodes = [],
  visitedEdges = [],
  pathNodes = [],
  pathEdges = [],
  animationSpeed = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getNodeColor = (node: Node) => {
    if (node.id === currentId) return '#F59E0B'; // Current node (amber)
    if (pathNodes.includes(node.id)) return '#8B5CF6'; // Path node (purple)
    if (node.id === endId) return '#EC4899'; // End node (pink)
    if (node.id === startId) return '#3B82F6'; // Start node (blue)
    if (visitedNodes.includes(node.id)) return '#10B981'; // Visited node (green)
    return '#6B7280'; // Default node (gray)
  };
  
  const getEdgeColor = (source: string, target: string) => {
    if (pathEdges.some(e => (e.source === source && e.target === target) || (e.source === target && e.target === source))) {
      return '#8B5CF6'; // Path edge (purple)
    }
    if (visitedEdges.some(e => (e.source === source && e.target === target) || (e.source === target && e.target === source))) {
      return '#10B981'; // Visited edge (green)
    }
    return '#D1D5DB'; // Default edge (light gray)
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Scale node positions to fit canvas
    const scalePositions = () => {
      const padding = 50;
      const xValues = graph.nodes.map(node => node.x);
      const yValues = graph.nodes.map(node => node.y);
      
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      
      const scaleX = (width - padding * 2) / Math.max(1, maxX - minX);
      const scaleY = (height - padding * 2) / Math.max(1, maxY - minY);
      
      return graph.nodes.map(node => ({
        ...node,
        x: (node.x - minX) * scaleX + padding,
        y: (node.y - minY) * scaleY + padding
      }));
    };
    
    const scaledNodes = scalePositions();
    
    // Draw edges with animation
    const drawEdge = (source: Node, target: Node, progress: number) => {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const endX = source.x + dx * progress;
      const endY = source.y + dy * progress;
      
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = getEdgeColor(source.id, target.id);
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw weight if edge is fully drawn
      if (progress === 1) {
        const edge = graph.edges.find(e => 
          (e.source === source.id && e.target === target.id) ||
          (e.source === target.id && e.target === source.id)
        );
        
        if (edge?.weight !== undefined) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(midX, midY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#E5E7EB';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.fillStyle = '#374151';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.weight.toString(), midX, midY);
        }
      }
    };
    
    // Draw nodes with animation
    const drawNode = (node: Node, progress: number) => {
      const radius = 15 * progress;
      
      // Draw node glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
      const nodeColor = getNodeColor(node);
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius + 3);
      gradient.addColorStop(0, nodeColor);
      gradient.addColorStop(1, `${nodeColor}00`);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      if (progress === 1) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      }
    };
    
    // Animate the graph
    let startTime: number | null = null;
    const duration = 1000 / animationSpeed;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw edges
      graph.edges.forEach(edge => {
        const source = scaledNodes.find(n => n.id === edge.source);
        const target = scaledNodes.find(n => n.id === edge.target);
        if (source && target) {
          drawEdge(source, target, progress);
        }
      });
      
      // Draw nodes
      scaledNodes.forEach(node => {
        drawNode(node, progress);
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [graph, startId, endId, currentId, visitedNodes, visitedEdges, pathNodes, pathEdges, animationSpeed]);
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
      />
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium mb-2">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Start Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span className="text-sm">End Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm">Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Visited Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm">Path Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;