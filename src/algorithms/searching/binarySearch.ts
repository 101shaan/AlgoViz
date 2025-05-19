import { AnimationStep } from '../../types';

export const binarySearchInfo = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  description: `
    Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly 
    dividing in half the portion of the list that could contain the item, until you've narrowed down the possible 
    locations to just one.
    
    This algorithm has a logarithmic time complexity, making it much faster than linear search for large datasets. 
    However, it requires that the list be sorted before searching begins.
  `,
  implementations: {
    javascript: `// JavaScript Implementation
function binarySearch(arr, target) {
  let left = 0;                           // Initialize left pointer to start of array
  let right = arr.length - 1;             // Initialize right pointer to end of array
  
  while (left <= right) {                 // Continue while there are elements to search
    const mid = Math.floor((left + right) / 2);  // Calculate middle index
    
    if (arr[mid] === target) {            // If middle element is the target
      return mid;                         // Return its index
    } else if (arr[mid] < target) {       // If middle element is less than target
      left = mid + 1;                     // Search in right half
    } else {                              // If middle element is greater than target
      right = mid - 1;                    // Search in left half
    }
  }
  
  return -1;                              // Target not found
}`,
    python: `# Python Implementation
def binary_search(arr, target):
    left = 0                              # Initialize left pointer to start of array
    right = len(arr) - 1                  # Initialize right pointer to end of array
    
    while left <= right:                  # Continue while there are elements to search
        mid = (left + right) // 2         # Calculate middle index
        
        if arr[mid] == target:            # If middle element is the target
            return mid                     # Return its index
        elif arr[mid] < target:           # If middle element is less than target
            left = mid + 1                # Search in right half
        else:                             # If middle element is greater than target
            right = mid - 1               # Search in left half
    
    return -1                             # Target not found`
  }
};

export function generateBinarySearchSteps(array: number[], target: number): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);
  
  // Initial state
  animations.push({
    step: 0,
    highlightedLines: [1],
    array: sortedArray,
    comparing: [],
    message: `Start binary search for target ${target}`,
  });
  
  binarySearchHelper(sortedArray, target, 0, sortedArray.length - 1, animations);
  
  return animations;
}

function binarySearchHelper(
  array: number[],
  target: number,
  low: number,
  high: number,
  animations: AnimationStep[]
): number {
  animations.push({
    step: animations.length,
    highlightedLines: [2],
    array: array,
    comparing: [low, high],
    message: `Check if high (${high}) < low (${low})`,
  });
  
  if (high < low) {
    animations.push({
      step: animations.length,
      highlightedLines: [3],
      array: array,
      comparing: [],
      message: `Target ${target} not found in array`,
      complete: true,
    });
    return -1;
  }
  
  const mid = Math.floor(low + (high - low) / 2);
  
  animations.push({
    step: animations.length,
    highlightedLines: [4],
    array: array,
    current: mid,
    comparing: [low, high],
    message: `Calculate mid = ${mid}`,
  });
  
  animations.push({
    step: animations.length,
    highlightedLines: [5],
    array: array,
    current: mid,
    comparing: [mid],
    message: `Compare ${array[mid]} with target ${target}`,
  });
  
  if (array[mid] > target) {
    animations.push({
      step: animations.length,
      highlightedLines: [6],
      array: array,
      current: mid,
      comparing: [low, mid - 1],
      message: `${array[mid]} > ${target}, search in left half`,
    });
    return binarySearchHelper(array, target, low, mid - 1, animations);
  } else if (array[mid] < target) {
    animations.push({
      step: animations.length,
      highlightedLines: [7, 8],
      array: array,
      current: mid,
      comparing: [mid + 1, high],
      message: `${array[mid]} < ${target}, search in right half`,
    });
    return binarySearchHelper(array, target, mid + 1, high, animations);
  } else {
    animations.push({
      step: animations.length,
      highlightedLines: [9, 10],
      array: array,
      current: mid,
      comparing: [mid],
      message: `${array[mid]} = ${target}, target found at index ${mid}`,
      complete: true,
    });
    return mid;
  }
}