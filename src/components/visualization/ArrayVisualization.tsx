import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayItem } from '../../types';

interface ArrayVisualizationProps {
  array: number[];
  current?: number;
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  containerClassName?: string;
  animationSpeed?: number;
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  array,
  current,
  comparing = [],
  swapping = [],
  sorted = [],
  containerClassName = '',
  animationSpeed = 1
}) => {
  const [items, setItems] = useState<ArrayItem[]>([]);
  const [maxValue, setMaxValue] = useState(0);
  
  useEffect(() => {
    if (!array || array.length === 0) return;
    
    const max = Math.max(...array);
    setMaxValue(max);
    
    const newItems = array.map((value, index) => {
      let status: ArrayItem['status'] = 'default';
      
      if (sorted.includes(index)) {
        status = 'sorted';
      } else if (swapping.includes(index)) {
        status = 'swapping';
      } else if (comparing.includes(index)) {
        status = 'comparing';
      } else if (current === index) {
        status = 'current';
      }
      
      return { value, status };
    });
    
    setItems(newItems);
  }, [array, current, comparing, swapping, sorted]);
  
  const getBarColor = (status: ArrayItem['status']) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 dark:bg-blue-400';
      case 'comparing':
        return 'bg-yellow-500 dark:bg-yellow-400';
      case 'swapping':
        return 'bg-red-500 dark:bg-red-400';
      case 'sorted':
        return 'bg-green-500 dark:bg-green-400';
      default:
        return 'bg-indigo-500 dark:bg-indigo-400';
    }
  };
  
  const getBarHeight = (value: number) => {
    const percentage = (value / maxValue) * 100;
    return `${Math.max(percentage, 5)}%`; // Ensure minimum height for visibility
  };
  
  return (
    <div className={`h-64 w-full flex items-end justify-center gap-1 ${containerClassName}`}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={`${index}-${item.value}`}
            className={`rounded-t-md width-full ${getBarColor(item.status)}`}
            style={{
              height: getBarHeight(item.value),
              width: `${100 / Math.max(array.length, 1)}%`,
              maxWidth: '50px',
              minWidth: '4px',
              transition: `height ${0.3 / animationSpeed}s ease-out`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 / animationSpeed }}
          >
            {array.length <= 20 && (
              <span className="absolute w-full text-center -top-6 text-xs font-medium">
                {item.value}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ArrayVisualization;