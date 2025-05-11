import React, { useRef, useEffect } from 'react';
import { Graph, Node, Edge } from '../../types';

interface GraphVisualizationProps {
  graph: Graph;
  startId?: string;
  endId?: string;
  currentId?: string;
  animationSpeed?: number;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graph,
  startId,
  endId,
  currentId,
  animationSpeed = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getNodeColor = (node: Node) => {
    if (node.id === startId) return '#3B82F6'; // Start node (blue)
    if (node.id === endId) return '#EC4899'; // End node (pink)
    if (node.id === currentId) return '#F59E0B'; // Current node (amber)
    if (node.status === 'visited') return '#10B981'; // Visited node (green)
    if (node.status === 'path') return '#8B5CF6'; // Path node (purple)
    return '#6B7280'; // Default node (gray)
  };
  
  const getEdgeColor = (edge: Edge) => {
    if (edge.status === 'path') return '#8B5CF6'; // Path edge (purple)
    if (edge.status === 'visited') return '#10B981'; // Visited edge (green)
    return '#D1D5DB'; // Default edge (light gray)
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas with a smooth animation
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
    
    // Animate edges with a growing line effect
    graph.edges.forEach((edge, index) => {
      const source = scaledNodes.find(node => node.id === edge.source);
      const target = scaledNodes.find(node => node.id === edge.target);
      
      if (!source || !target) return;
      
      setTimeout(() => {
        // Draw edge with animation
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = getEdgeColor(edge);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw weight if it exists
        if (edge.weight !== undefined) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          // Draw weight background
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(midX, midY, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#E5E7EB';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Draw weight text
          ctx.fillStyle = '#374151';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.weight.toString(), midX, midY);
        }
      }, index * (50 / animationSpeed));
    });
    
    // Animate nodes with a fade-in effect
    scaledNodes.forEach((node, index) => {
      setTimeout(() => {
        // Draw node glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
        const nodeColor = getNodeColor(node);
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 18);
        gradient.addColorStop(0, nodeColor);
        gradient.addColorStop(1, `${nodeColor}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = getNodeColor(node);
        ctx.fill();
        
        // Draw node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw node label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      }, (graph.edges.length + index) * (50 / animationSpeed));
    });
    
  }, [graph, startId, endId, currentId, animationSpeed]);
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
    />
  );
};

export default GraphVisualization;