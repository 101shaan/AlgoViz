import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlgorithmCardProps {
  algorithm: {
    id: string;
    title: string;
    category: string;
    complexity: string;
    description: string;
    difficulty: string;
    path: string;
  };
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
  const navigate = useNavigate();

  const difficultyColor = {
    'Beginner': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Intermediate': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'Advanced': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  };

  const categoryColor = {
    'Sorting': 'text-blue-600 dark:text-blue-400',
    'Searching': 'text-green-600 dark:text-green-400',
    'Pathfinding': 'text-rose-600 dark:text-rose-400',
    'Graph': 'text-purple-600 dark:text-purple-400'
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col"
      whileHover={{ y: -5 }}
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-sm font-medium ${categoryColor[algorithm.category as keyof typeof categoryColor]}`}>
            {algorithm.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor[algorithm.difficulty as keyof typeof difficultyColor]}`}>
            {algorithm.difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{algorithm.title}</h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {algorithm.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Clock className="w-4 h-4 mr-1" />
          <span>Time Complexity: {algorithm.complexity}</span>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <button
          onClick={() => navigate(algorithm.path)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          Visualize <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default AlgorithmCard;