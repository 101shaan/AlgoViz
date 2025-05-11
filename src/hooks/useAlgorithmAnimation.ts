import { useState, useEffect, useRef } from 'react';
import { AnimationStep } from '../types';

interface UseAlgorithmAnimationProps {
  steps: AnimationStep[];
  speed?: number;
  autoPlay?: boolean;
}

export function useAlgorithmAnimation({
  steps,
  speed = 1,
  autoPlay = false
}: UseAlgorithmAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [animationSpeed, setAnimationSpeed] = useState(speed);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Reset animation if steps change
  useEffect(() => {
    resetAnimation();
  }, [steps]);
  
  // Handle animation playback
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    const delay = 1000 / animationSpeed;
    
    timerRef.current = setTimeout(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    }, delay);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentStep, isPlaying, steps.length, animationSpeed]);
  
  const playAnimation = () => {
    if (currentStep >= steps.length - 1) {
      resetAnimation();
    }
    setIsPlaying(true);
  };
  
  const pauseAnimation = () => {
    setIsPlaying(false);
  };
  
  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };
  
  const changeSpeed = (newSpeed: number) => {
    setAnimationSpeed(newSpeed);
  };
  
  return {
    currentStep,
    currentStepData: steps[currentStep],
    isPlaying,
    animationSpeed,
    totalSteps: steps.length,
    playAnimation,
    pauseAnimation,
    resetAnimation,
    stepForward,
    stepBackward,
    goToStep,
    changeSpeed
  };
}