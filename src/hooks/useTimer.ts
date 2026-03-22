import { useState, useRef, useCallback, useEffect } from "react";

export interface TimerState {
  timeRemaining: number;
  timeSpent: number;
  isRunning: boolean;
  isTimeUp: boolean;
  formatted: string;
  percentage: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function useTimer(initialTime: number = 60) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const initialTimeRef = useRef(initialTime);

  // Update when initial time changes (new level)
  useEffect(() => {
    initialTimeRef.current = initialTime;
    setTimeRemaining(initialTime);
    setIsTimeUp(false);
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [initialTime]);

  const start = useCallback(() => {
    if (isRunning || isTimeUp) return;
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning, isTimeUp]);

  // Check for time up
  useEffect(() => {
    if (timeRemaining <= 0 && isRunning) {
      setIsTimeUp(true);
      setIsRunning(false);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [timeRemaining, isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback((newTime?: number) => {
    stop();
    const resetTime = newTime !== undefined ? newTime : initialTimeRef.current;
    setTimeRemaining(resetTime);
    setIsTimeUp(false);
    if (newTime !== undefined) {
      initialTimeRef.current = newTime;
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const timeSpent = initialTimeRef.current - timeRemaining;
  const percentage = (timeRemaining / initialTimeRef.current) * 100;

  return {
    timeRemaining,
    timeSpent,
    isRunning,
    isTimeUp,
    formatted: formatTime(timeRemaining),
    formattedSpent: formatTime(timeSpent),
    percentage,
    initialTime: initialTimeRef.current,
    start,
    pause,
    stop,
    reset,
  };
}
