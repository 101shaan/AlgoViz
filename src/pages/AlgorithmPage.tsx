import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Info, Clock, MoveRight, LineChart, ArrowRightCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PseudocodeDisplay from '../components/visualization/PseudocodeDisplay';
import ArrayVisualization from '../components/visualization/ArrayVisualization';
import GraphVisualization from '../components/visualization/GraphVisualization';
import AnimationControls from '../components/visualization/AnimationControls';
import { useAlgorithmAnimation } from '../hooks/useAlgorithmAnimation';

// Import algorithm data
import { bubbleSortInfo, generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { binarySearchInfo, generateBinarySearchSteps } from '../algorithms/searching/binarySearch';
import { dijkstraInfo, generateDijkstraSteps } from '../algorithms/pathfinding/dijkstra';
import { bfsInfo, generateBFSSteps } from '../algorithms/graph/bfs';

const AlgorithmPage: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const [currentAlgorithm, setCurrentAlgorithm] = useState<any>(null);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [searchTarget, setSearchTarget] = useState<number>(0);
  const [infoExpanded, setInfoExpanded] = useState(false);
  
  // Generate a test graph for pathfinding algorithms
  const testGraph = {
    nodes: [
      { id: 'A', x: 50, y: 50, status: 'default' },
      { id: 'B', x: 150, y: 50, status: 'default' },
      { id: 'C', x: 100, y: 150, status: 'default' },
      { id: 'D', x: 200, y: 150, status: 'default' },
      { id: 'E', x: 50, y: 250, status: 'default' },
      { id: 'F', x: 150, y: 250, status: 'default' },
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4, status: 'default' },
      { source: 'A', target: 'C', weight: 2, status: 'default' },
      { source: 'B', target: 'D', weight: 5, status: 'default' },
      { source: 'C', target: 'D', weight: 1, status: 'default' },
      { source: 'C', target: 'E', weight: 6, status: 'default' },
      { source: 'D', target: 'F', weight: 3, status: 'default' },
      { source: 'E', target: 'F', weight: 2, status: 'default' },
    ]
  };
  
  // Setup animation hook
  const {
    currentStep,
    currentStepData,
    isPlaying,
    animationSpeed,
    totalSteps,
    playAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    goToStep,
    changeSpeed
  } = useAlgorithmAnimation({
    steps: animationSteps,
    speed: 1,
    autoPlay: false
  });
  
  // Load algorithm data based on ID parameter
  useEffect(() => {
    let algorithm;
    
    switch (algorithmId) {
      case 'bubble-sort':
        algorithm = bubbleSortInfo;
        setCustomInput('64,34,25,12,22,11,90');
        break;
      case 'binary-search':
        algorithm = binarySearchInfo;
        setCustomInput('5,10,15,20,25,30,35,40,45,50');
        setSearchTarget(25);
        break;
      case 'dijkstra':
        algorithm = dijkstraInfo;
        break;
      case 'bfs':
        algorithm = bfsInfo;
        break;
      default:
        algorithm = bubbleSortInfo;
        setCustomInput('64,34,25,12,22,11,90');
    }
    
    setCurrentAlgorithm(algorithm);
  }, [algorithmId]);
  
  // Generate animation steps when algorithm or inputs change
  useEffect(() => {
    if (!currentAlgorithm) return;
    
    try {
      let steps;
      
      switch (currentAlgorithm.id) {
        case 'bubble-sort': {
          const array = customInput.split(',').map(x => parseInt(x.trim()));
          steps = generateBubbleSortSteps(array);
          break;
        }
        case 'binary-search': {
          const array = customInput.split(',').map(x => parseInt(x.trim()));
          steps = generateBinarySearchSteps(array, searchTarget);
          break;
        }
        case 'dijkstra':
          steps = generateDijkstraSteps(testGraph, 'A', 'F');
          break;
        case 'bfs':
          steps = generateBFSSteps(testGraph, 'A');
          break;
        default:
          steps = [];
      }
      
      setAnimationSteps(steps);
      resetAnimation();
    } catch (error) {
      console.error('Error generating animation steps:', error);
    }
  }, [currentAlgorithm, customInput, searchTarget]);
  
  if (!currentAlgorithm) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const handleRunAlgorithm = () => {
    try {
      let steps;
      
      switch (currentAlgorithm.id) {
        case 'bubble-sort': {
          const array = customInput.split(',').map(x => parseInt(x.trim()));
          steps = generateBubbleSortSteps(array);
          break;
        }
        case 'binary-search': {
          const array = customInput.split(',').map(x => parseInt(x.trim()));
          steps = generateBinarySearchSteps(array, searchTarget);
          break;
        }
        case 'dijkstra':
          steps = generateDijkstraSteps(testGraph, 'A', 'F');
          break;
        case 'bfs':
          steps = generateBFSSteps(testGraph, 'A');
          break;
        default:
          steps = [];
      }
      
      setAnimationSteps(steps);
      resetAnimation();
    } catch (error) {
      console.error('Error running algorithm:', error);
    }
  };
  
  const isGraphAlgorithm = currentAlgorithm.category === 'pathfinding' || currentAlgorithm.category === 'graph';
  
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
        <h1 className="text-3xl font-bold">{currentAlgorithm.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Visualization</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step: {currentStep + 1} of {totalSteps}
              </div>
            </div>
            
            {/* Visualization component based on algorithm type */}
            <div className="mb-6">
              {isGraphAlgorithm ? (
                <GraphVisualization 
                  graph={testGraph}
                  startId="A"
                  endId="F"
                  currentId={currentStepData?.current}
                  animationSpeed={animationSpeed}
                />
              ) : (
                <ArrayVisualization 
                  array={currentStepData?.array || []}
                  current={currentStepData?.current}
                  comparing={currentStepData?.comparing || []}
                  swapping={currentStepData?.swapping || []}
                  animationSpeed={animationSpeed}
                />
              )}
            </div>
            
            {/* Message */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-gray-800 dark:text-gray-200">
                {currentStepData?.message || 'Click play to start the animation'}
              </p>
            </div>
            
            {/* Controls */}
            <AnimationControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              speed={animationSpeed}
              onPlay={playAnimation}
              onPause={pauseAnimation}
              onReset={resetAnimation}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onSpeedChange={changeSpeed}
              onSliderChange={goToStep}
            />
          </div>
          
          {/* Pseudocode */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pseudocode</h2>
            <PseudocodeDisplay 
              code={currentAlgorithm.pseudocode}
              highlightedLines={currentStepData?.highlightedLines || []}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Algorithm Info */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            initial={{ height: 'auto' }}
            animate={{ height: infoExpanded ? 'auto' : '250px' }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Algorithm Details
                </h2>
                <button
                  onClick={() => setInfoExpanded(!infoExpanded)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {infoExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    {currentAlgorithm.category.charAt(0).toUpperCase() + currentAlgorithm.category.slice(1)}
                  </div>
                  <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentAlgorithm.timeComplexity.average}
                  </div>
                </div>
                
                <div className={`prose dark:prose-invert max-w-none text-sm ${!infoExpanded ? 'line-clamp-5' : ''}`}>
                  {currentAlgorithm.description}
                </div>
                
                {infoExpanded && (
                  <div className="pt-4 space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Time Complexity</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-500 dark:text-gray-400 mb-1">Best Case</div>
                          <div className="font-mono">{currentAlgorithm.timeComplexity.best}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-500 dark:text-gray-400 mb-1">Average</div>
                          <div className="font-mono">{currentAlgorithm.timeComplexity.average}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-500 dark:text-gray-400 mb-1">Worst Case</div>
                          <div className="font-mono">{currentAlgorithm.timeComplexity.worst}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Space Complexity</h3>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="font-mono">{currentAlgorithm.spaceComplexity}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Stability</h3>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div>{currentAlgorithm.stable ? 'Stable' : 'Unstable'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Custom Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Custom Input</h2>
            
            {!isGraphAlgorithm && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Array (comma-separated numbers)
                  </label>
                  <input
                    id="array-input"
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="e.g. 5,3,8,4,2"
                  />
                </div>
                
                {currentAlgorithm.category === 'searching' && (
                  <div>
                    <label htmlFor="target-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Search Target
                    </label>
                    <input
                      id="target-input"
                      type="number"
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}
              </div>
            )}
            
            {isGraphAlgorithm && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Graph customization is not available in this demo. Using a pre-defined graph.
              </div>
            )}
            
            <button
              onClick={handleRunAlgorithm}
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Run Algorithm <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
          
          {/* Related Algorithms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Related Algorithms</h2>
            
            <div className="space-y-3">
              {(() => {
                // Generate related algorithms based on category
                let relatedAlgos = [];
                
                switch (currentAlgorithm.category) {
                  case 'sorting':
                    relatedAlgos = [
                      { id: 'bubble-sort', name: 'Bubble Sort' },
                      { id: 'quick-sort', name: 'Quick Sort' },
                      { id: 'merge-sort', name: 'Merge Sort' },
                    ];
                    break;
                  case 'searching':
                    relatedAlgos = [
                      { id: 'binary-search', name: 'Binary Search' },
                      { id: 'linear-search', name: 'Linear Search' },
                    ];
                    break;
                  case 'pathfinding':
                    relatedAlgos = [
                      { id: 'dijkstra', name: 'Dijkstra\'s Algorithm' },
                      { id: 'a-star', name: 'A* Search' },
                    ];
                    break;
                  case 'graph':
                    relatedAlgos = [
                      { id: 'bfs', name: 'Breadth-First Search' },
                      { id: 'dfs', name: 'Depth-First Search' },
                    ];
                    break;
                }
                
                // Filter out the current algorithm
                relatedAlgos = relatedAlgos.filter(algo => algo.id !== currentAlgorithm.id);
                
                return relatedAlgos.map(algo => (
                  <Link
                    key={algo.id}
                    to={`/algorithm/${algo.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>{algo.name}</span>
                    <MoveRight className="w-4 h-4 text-gray-500" />
                  </Link>
                ));
              })()}
              
              <Link
                to="/compare"
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-700 dark:text-blue-300"
              >
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  <span>Compare Algorithms</span>
                </div>
                <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmPage;