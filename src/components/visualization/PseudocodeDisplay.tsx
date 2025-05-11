import React from 'react';
import { motion } from 'framer-motion';

interface PseudocodeDisplayProps {
  code: string[];
  highlightedLines: number[];
}

const PseudocodeDisplay: React.FC<PseudocodeDisplayProps> = ({ code, highlightedLines }) => {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">Pseudocode</h3>
      </div>
      <div className="p-4 overflow-auto max-h-96 font-mono text-sm">
        <pre className="whitespace-pre">
          {code.map((line, index) => {
            const isHighlighted = highlightedLines.includes(index + 1);
            const indentation = line.search(/\S|$/);
            
            return (
              <motion.div
                key={index}
                className={`py-1 pl-2 -ml-2 rounded-md font-mono ${
                  isHighlighted
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    : ''
                }`}
                initial={isHighlighted ? { backgroundColor: 'rgba(0,0,0,0)' } : {}}
                animate={
                  isHighlighted
                    ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                <span className="inline-block w-7 text-gray-400 select-none text-right mr-3">
                  {index + 1}
                </span>
                <span style={{ marginLeft: `${indentation * 0.5}rem` }}>
                  {line.trim()}
                </span>
              </motion.div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default PseudocodeDisplay;