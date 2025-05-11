import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause, BarChart4, Search, GitGraph, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrayVisualization from '../components/visualization/ArrayVisualization';
import AnimationControls from '../components/visualization/AnimationControls';

// Import algorithm data
import { bubbleSortInfo, generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { binarySearchInfo, generateBinarySearchSteps } from '../algorithms/searching/binarySearch';
import { dijkstraInfo } from '../algorithms/pathfinding/dijkstra';
import { bfsInfo } from '../algorithms/graph/bfs';

const ComparisonPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('sorting');
  const [customInput, setCustomInput] = useState<string>('64,34,25,12,22,11,90');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmData, setAlgorithmData] = useState<any[]>([]);
  
  const categories = [
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      icon: <BarChart4 className="w-5 h-5" />,
      algorithms: [
        { id: 'bubble-sort', name: 'Bubble Sort', info: bubbleSortInfo }
      ]
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      icon: <Search className="w-5 h-5" />,
      algorithms: [
        { id: 'binary-search', name: 'Binary Search', info: binarySearchInfo }
      ]
    },
    {
      id: 'pathfinding',
      name: 'Pathfinding Algorithms',
      icon: <Map className="w-5 h-5" />,
      algorithms: [
        { id: 'dijkstra', name: 'Dijkstra\'s Algorithm', info: dijkstraInfo }
      ]
    },
    {
      id: 'graph',
      name: 'Graph Algorithms',
      icon: <GitGraph className="w-5 h-5" />,
      algorithms: [
        { id: 'bfs', name: 'Breadth-First Search', info: bfsInfo }
      ]
    }
  ];
  
  // Get the current category
  const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0];
  
  // Generate animation steps
  useEffect(() => {
    try {
      if (selectedCategory === 'sorting') {
        const array = customInput.split(',').map(x => parseInt(x.trim()));
        
        // Generate steps for each sorting algorithm
        const bubbleSortSteps = generateBubbleSortSteps([...array]);
        
        setAlgorithmData([
          {
            id: 'bubble-sort',
            name: 'Bubble Sort',
            steps: bubbleSortSteps,
            currentStepData: bubbleSortSteps[0],
            info: bubbleSortInfo // Add the info object here
          }
        ]);
      } else if (selectedCategory === 'searching') {
        const array = customInput.split(',').map(x => parseInt(x.trim()));
        const target = 25; // Target value to search for
        
        // Generate steps for each searching algorithm
        const binarySearchSteps = generateBinarySearchSteps([...array], target);
        
        setAlgorithmData([
          {
            id: 'binary-search',
            name: 'Binary Search',
            steps: binarySearchSteps,
            currentStepData: binarySearchSteps[0],
            info: binarySearchInfo // Add the info object here
          }
        ]);
      } else {
        // For pathfinding and graph, we'll just show placeholders
        setAlgorithmData([]);
      }
      
      // Reset animation state
      setCurrentStep(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error generating comparison data:', error);
    }
  }, [selectedCategory, customInput]);
  
  // Update current step data when step changes
  useEffect(() => {
    setAlgorithmData(prevData => 
      prevData.map(algo => ({
        ...algo,
        currentStepData: algo.steps[Math.min(currentStep, algo.steps.length - 1)]
      }))
    );
  }, [currentStep]);
  
  // Auto-advance animation when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const maxSteps = Math.max(...algorithmData.map(algo => algo.steps.length));
    if (currentStep >= maxSteps - 1) {
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 1000 / animationSpeed);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, animationSpeed, algorithmData]);
  
  // Play/pause animation
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If we're at the end, reset to beginning
      if (currentStep >= Math.max(...algorithmData.map(algo => algo.steps.length)) - 1) {
        setCurrentStep(0);
      }
      setIsPlaying(true);
    }
  };
  
  // Reset animation
  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  // Step forward
  const stepForward = () => {
    const maxSteps = Math.max(...algorithmData.map(algo => algo.steps.length));
    if (currentStep < maxSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Step backward
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Change animation speed
  const changeSpeed = (speed: number) => {
    setAnimationSpeed(speed);
  };
  
  // Go to specific step
  const goToStep = (step: number) => {
    const maxSteps = Math.max(...algorithmData.map(algo => algo.steps.length));
    if (step >= 0 && step < maxSteps) {
      setCurrentStep(step);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          to="/"
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold">Algorithm Comparison</h1>
      </div>
      
      {/* Category Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Select Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              className={`p-4 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedCategory === category.id
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {category.icon}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom Input */}
      {(selectedCategory === 'sorting' || selectedCategory === 'searching') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Input Data</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Array (comma-separated numbers)
              </label>
              <div className="flex gap-2">
                <input
                  id="array-input"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="e.g. 5,3,8,4,2"
                />
                <button
                  onClick={resetAnimation}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Comparison Visualizations */}
      {algorithmData.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithmData.map(algo => (
              <motion.div
                key={algo.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{algo.name}</h3>
                  <Link
                    to={`/algorithm/${algo.id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
                
                <div className="mb-6">
                  <ArrayVisualization 
                    array={algo.currentStepData?.array || []}
                    current={algo.currentStepData?.current}
                    comparing={algo.currentStepData?.comparing || []}
                    swapping={algo.currentStepData?.swapping || []}
                    animationSpeed={animationSpeed}
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 h-16 overflow-y-auto">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {algo.currentStepData?.message || 'Click play to start the animation'}
                  </p>
                </div>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time Complexity:</span>
                    <span className="font-mono">{algo.info?.timeComplexity?.average || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Space Complexity:</span>
                    <span className="font-mono">{algo.info?.spaceComplexity || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Animation Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <AnimationControls
              currentStep={currentStep}
              totalSteps={Math.max(...algorithmData.map(algo => algo.steps.length))}
              isPlaying={isPlaying}
              speed={animationSpeed}
              onPlay={togglePlayPause}
              onPause={togglePlayPause}
              onReset={resetAnimation}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onSpeedChange={changeSpeed}
              onSliderChange={goToStep}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {selectedCategory === 'pathfinding' || selectedCategory === 'graph' 
              ? `${currentCategory.name} comparison is not available in this demo yet.`
              : 'Select a category to start comparison'}
          </p>
          <Link
            to={`/algorithm/${currentCategory.algorithms[0]?.id || 'bubble-sort'}`}
            className="mt-4 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            View {currentCategory.algorithms[0]?.name || 'Algorithm'} Details Instead
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;