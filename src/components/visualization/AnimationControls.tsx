import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, ChevronDown, Clock } from 'lucide-react';

interface AnimationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onSliderChange: (step: number) => void;
  disabled?: boolean;
  className?: string;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onSliderChange,
  disabled = false,
  className = '',
}) => {
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  
  // Close speed dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSpeedDropdown) {
        setShowSpeedDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSpeedDropdown]);
  
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
  ];
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          onClick={onReset}
          disabled={disabled}
          aria-label="Reset animation"
        >
          <RefreshCw size={18} />
        </button>
        
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          onClick={onStepBackward}
          disabled={disabled || currentStep <= 0}
          aria-label="Step backward"
        >
          <SkipBack size={18} />
        </button>
        
        <button
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled || (isPlaying && currentStep >= totalSteps - 1)}
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          aria-label="Step forward"
        >
          <SkipForward size={18} />
        </button>
        
        <div className="relative ml-auto">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowSpeedDropdown(!showSpeedDropdown);
            }}
            disabled={disabled}
            aria-label="Change animation speed"
          >
            <Clock size={16} />
            <span>{speed}x</span>
            <ChevronDown size={14} />
          </button>
          
          {showSpeedDropdown && (
            <div className="absolute right-0 top-full mt-1 z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-24">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    speed === option.value ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeedChange(option.value);
                    setShowSpeedDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12">
          {currentStep + 1}/{totalSteps}
        </span>
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onSliderChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        />
      </div>
    </div>
  );
};

export default AnimationControls;