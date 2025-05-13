import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChart4, Search, GitGraph, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import AlgorithmCard from '../components/common/AlgorithmCard';

const AlgorithmsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const targetSection = location.hash.slice(1);

  const algorithms = {
    sorting: [
      {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        category: 'Sorting',
        complexity: 'O(n²)',
        description: 'A simple comparison sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
        difficulty: 'Beginner',
        path: '/algorithm/bubble-sort',
        implemented: true
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        category: 'Sorting',
        complexity: 'O(n log n)',
        description: 'An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy to sort elements.',
        difficulty: 'Intermediate',
        path: '/algorithm/quick-sort',
        implemented: false
      },
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        category: 'Sorting',
        complexity: 'O(n log n)',
        description: 'A divide-and-conquer sorting algorithm that recursively divides the array into smaller subarrays.',
        difficulty: 'Intermediate',
        path: '/algorithm/merge-sort',
        implemented: false
      }
    ],
    searching: [
      {
        id: 'binary-search',
        title: 'Binary Search',
        category: 'Searching',
        complexity: 'O(log n)',
        description: 'A search algorithm that finds the position of a target value within a sorted array.',
        difficulty: 'Beginner',
        path: '/algorithm/binary-search',
        implemented: true
      },
      {
        id: 'linear-search',
        title: 'Linear Search',
        category: 'Searching',
        complexity: 'O(n)',
        description: 'A simple search algorithm that checks each element in sequence.',
        difficulty: 'Beginner',
        path: '/algorithm/linear-search',
        implemented: false
      }
    ],
    pathfinding: [
      {
        id: 'dijkstra',
        title: 'Dijkstra\'s Algorithm',
        category: 'Pathfinding',
        complexity: 'O(E + V log V)',
        description: 'An algorithm for finding the shortest paths between nodes in a weighted graph.',
        difficulty: 'Intermediate',
        path: '/algorithm/dijkstra',
        implemented: true
      },
      {
        id: 'a-star',
        title: 'A* Search',
        category: 'Pathfinding',
        complexity: 'O(E)',
        description: 'A pathfinding algorithm that uses heuristics to find the optimal path.',
        difficulty: 'Advanced',
        path: '/algorithm/a-star',
        implemented: false
      }
    ],
    graph: [
      {
        id: 'bfs',
        title: 'Breadth-First Search',
        category: 'Graph',
        complexity: 'O(V + E)',
        description: 'A graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level.',
        difficulty: 'Intermediate',
        path: '/algorithm/bfs',
        implemented: true
      },
      {
        id: 'dfs',
        title: 'Depth-First Search',
        category: 'Graph',
        complexity: 'O(V + E)',
        description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
        difficulty: 'Intermediate',
        path: '/algorithm/dfs',
        implemented: false
      }
    ]
  };

  const categories = [
    {
      id: 'sorting',
      title: 'Sorting Algorithms',
      icon: <BarChart4 className="w-6 h-6" />,
      description: 'Arrange elements in a specific order'
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      icon: <Search className="w-6 h-6" />,
      description: 'Find elements within a data structure'
    },
    {
      id: 'pathfinding',
      title: 'Pathfinding Algorithms',
      icon: <Map className="w-6 h-6" />,
      description: 'Find optimal paths between points'
    },
    {
      id: 'graph',
      title: 'Graph Algorithms',
      icon: <GitGraph className="w-6 h-6" />,
      description: 'Process and analyze connected data'
    }
  ];

  useEffect(() => {
    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Add highlight animation
        element.classList.add('highlight-section');
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 2000);
      }
    }
  }, [targetSection]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold">Algorithm Library</h1>
      </div>

      {categories.map((category) => (
        <motion.section
          key={category.id}
          id={category.id}
          className="space-y-6 scroll-mt-24 transition-colors duration-500"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {category.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms[category.id as keyof typeof algorithms].map((algorithm) => (
              <motion.div key={algorithm.id} variants={item}>
                <AlgorithmCard algorithm={algorithm} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default AlgorithmsPage;