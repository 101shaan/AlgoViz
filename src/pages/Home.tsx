import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, BarChart4, Search, GitGraph, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import AlgorithmCard from '../components/common/AlgorithmCard';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'sorting',
      title: 'Sorting Algorithms',
      description: 'Arrange elements in a specific order',
      icon: <BarChart4 className="w-6 h-6 text-blue-500" />,
      algorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort'],
      color: 'from-blue-500 to-indigo-500',
      link: '/algorithm/bubble-sort'
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      description: 'Find an element within a data structure',
      icon: <Search className="w-6 h-6 text-green-500" />,
      algorithms: ['Binary Search', 'Linear Search'],
      color: 'from-green-500 to-emerald-500',
      link: '/algorithm/binary-search'
    },
    {
      id: 'graph',
      title: 'Graph Algorithms',
      description: 'Process and analyze connected data',
      icon: <GitGraph className="w-6 h-6 text-purple-500" />,
      algorithms: ['Breadth-First Search', 'Depth-First Search'],
      color: 'from-purple-500 to-violet-500',
      link: '/algorithm/bfs'
    },
    {
      id: 'pathfinding',
      title: 'Pathfinding Algorithms',
      description: 'Find the best path between points',
      icon: <Map className="w-6 h-6 text-rose-500" />,
      algorithms: ['Dijkstra\'s Algorithm', 'A* Search'],
      color: 'from-rose-500 to-pink-500',
      link: '/algorithm/dijkstra'
    }
  ];

  const featuredAlgorithms = [
    {
      id: 'bubble-sort',
      title: 'Bubble Sort',
      category: 'Sorting',
      complexity: 'O(n²)',
      description: 'A simple comparison sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
      difficulty: 'Beginner',
      path: '/algorithm/bubble-sort'
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      category: 'Searching',
      complexity: 'O(log n)',
      description: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search space in half.',
      difficulty: 'Beginner',
      path: '/algorithm/binary-search'
    },
    {
      id: 'dijkstra',
      title: 'Dijkstra\'s Algorithm',
      category: 'Pathfinding',
      complexity: 'O(E + V log V)',
      description: 'An algorithm for finding the shortest paths between nodes in a weighted graph.',
      difficulty: 'Intermediate',
      path: '/algorithm/dijkstra'
    }
  ];

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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl" />
        <div className="relative py-12 md:py-20 px-6 md:px-12 rounded-3xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Visualize & Understand Algorithms
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
              Learn how algorithms work through interactive visualizations, animations, and step-by-step code execution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/algorithm/bubble-sort')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                Start Exploring <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/compare')}
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
              >
                Compare Algorithms
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Algorithm Categories */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Algorithm Categories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore different types of algorithms and see how they work in action
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full border border-gray-200 dark:border-gray-700"
                onClick={() => navigate(category.link)}
              >
                <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                <ul className="space-y-1 mb-4">
                  {category.algorithms.map((algo) => (
                    <li key={algo} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                      {algo}
                    </li>
                  ))}
                </ul>
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline"
                  onClick={() => navigate(category.link)}
                >
                  Explore {category.id} <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Algorithms */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Algorithms</h2>
          <button 
            onClick={() => navigate('/compare')}
            className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
          >
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredAlgorithms.map((algorithm) => (
            <motion.div key={algorithm.id} variants={item}>
              <AlgorithmCard algorithm={algorithm} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Use AlgoViz */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Use AlgoViz?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our platform offers unique features designed to make learning algorithms intuitive and engaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Learning",
              description: "See algorithms in action with smooth, clear animations that illustrate each step of the process.",
            },
            {
              title: "Interactive Code",
              description: "Follow along with highlighted pseudocode that syncs with the visualization to understand what's happening.",
            },
            {
              title: "Compare Algorithms",
              description: "See multiple algorithms side-by-side to understand their differences in approach and efficiency.",
            },
            {
              title: "Performance Metrics",
              description: "Understand the time and space complexity of each algorithm with clear explanations.",
            },
            {
              title: "Custom Inputs",
              description: "Test algorithms with your own data to see how they handle different scenarios.",
            },
            {
              title: "Comprehensive Explanations",
              description: "Learn the theory behind each algorithm with detailed, accessible explanations.",
            }
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;