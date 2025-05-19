import { AnimationStep } from '../../types';

export const bubbleSortInfo = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  description: `
    Bubble Sort is a simple comparison-based sorting algorithm. It works by repeatedly stepping through the list, 
    comparing adjacent elements, and swapping them if they are in the wrong order. The algorithm gets its name 
    because smaller elements "bubble" to the top of the list.
    
    This algorithm is not suitable for large datasets as its average and worst-case time complexity is O(n²), 
    where n is the number of items being sorted. However, it's one of the simplest sorting algorithms to understand 
    and implement.
  `,
  implementations: {
    javascript: `// JavaScript Implementation
function bubbleSort(arr) {
  const n = arr.length;                    // Get the length of the array
  
  for (let i = 0; i < n; i++) {           // Outer loop: n iterations
    for (let j = 0; j < n - 1 - i; j++) { // Inner loop: Skip last i elements (already sorted)
      if (arr[j] > arr[j + 1]) {          // If current element is greater than next
        // Swap elements using destructuring
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;                             // Return the sorted array
}`,
    python: `# Python Implementation
def bubble_sort(arr):
    n = len(arr)                          # Get the length of the array
    
    for i in range(n):                    # Outer loop: n iterations
        for j in range(n - 1 - i):        # Inner loop: Skip last i elements (already sorted)
            if arr[j] > arr[j + 1]:       # If current element is greater than next
                # Swap elements using Python's multiple assignment
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr                            # Return the sorted array`
  },
  pseudocode: [
    'procedure bubbleSort(A: list of sortable items)',
    '    n := length(A)',
    '    repeat',
    '        swapped := false',
    '        for i := 1 to n-1 inclusive do',
    '            if A[i-1] > A[i] then',
    '                swap(A[i-1], A[i])',
    '                swapped := true',
    '            end if',
    '        end for',
    '        n := n - 1',
    '    until not swapped',
    'end procedure',
  ],
};

export function generateBubbleSortSteps(array: number[]): AnimationStep[] {
  const animations: AnimationStep[] = [];
  const arrayCopy = [...array];
  let n = arrayCopy.length;
  
  // Initial state
  animations.push({
    step: 0,
    highlightedLines: [1],
    array: [...arrayCopy],
    comparing: [],
    swapping: [],
    message: 'Start bubble sort algorithm',
  });
  
  let swapped: boolean;
  
  animations.push({
    step: animations.length,
    highlightedLines: [2],
    array: [...arrayCopy],
    comparing: [],
    swapping: [],
    message: `Set n = ${n}`,
  });
  
  do {
    animations.push({
      step: animations.length,
      highlightedLines: [3, 4],
      array: [...arrayCopy],
      comparing: [],
      swapping: [],
      message: 'Start a new pass through the array',
    });
    
    swapped = false;
    
    for (let i = 1; i < n; i++) {
      animations.push({
        step: animations.length,
        highlightedLines: [5],
        array: [...arrayCopy],
        current: i,
        comparing: [i-1, i],
        swapping: [],
        message: `Compare ${arrayCopy[i-1]} and ${arrayCopy[i]}`,
      });
      
      if (arrayCopy[i-1] > arrayCopy[i]) {
        animations.push({
          step: animations.length,
          highlightedLines: [6],
          array: [...arrayCopy],
          current: i,
          comparing: [i-1, i],
          swapping: [],
          message: `${arrayCopy[i-1]} > ${arrayCopy[i]}, need to swap`,
        });
        
        // Swap
        animations.push({
          step: animations.length,
          highlightedLines: [7],
          array: [...arrayCopy],
          current: i,
          comparing: [],
          swapping: [i-1, i],
          message: `Swap ${arrayCopy[i-1]} and ${arrayCopy[i]}`,
        });
        
        const temp = arrayCopy[i-1];
        arrayCopy[i-1] = arrayCopy[i];
        arrayCopy[i] = temp;
        
        animations.push({
          step: animations.length,
          highlightedLines: [8],
          array: [...arrayCopy],
          current: i,
          comparing: [],
          swapping: [],
          message: 'Set swapped = true',
        });
        
        swapped = true;
      } else {
        animations.push({
          step: animations.length,
          highlightedLines: [5, 6],
          array: [...arrayCopy],
          current: i,
          comparing: [i-1, i],
          swapping: [],
          message: `${arrayCopy[i-1]} <= ${arrayCopy[i]}, no swap needed`,
        });
      }
    }
    
    animations.push({
      step: animations.length,
      highlightedLines: [11],
      array: [...arrayCopy],
      comparing: [],
      swapping: [],
      message: `Decrement n: ${n} -> ${n-1}`,
    });
    
    n--;
    
  } while (swapped);
  
  animations.push({
    step: animations.length,
    highlightedLines: [12, 13],
    array: [...arrayCopy],
    comparing: [],
    swapping: [],
    message: 'Array is sorted',
    complete: true,
  });
  
  return animations;
}