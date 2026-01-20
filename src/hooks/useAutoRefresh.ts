import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshOptions {
  defaultInterval?: number; // in seconds
  onRefresh?: () => void | Promise<void>;
  enabled?: boolean;
}

export function useAutoRefresh({ 
  defaultInterval = 30, 
  onRefresh,
  enabled = true 
}: UseAutoRefreshOptions = {}) {
  const [interval, setInterval_] = useState(defaultInterval);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(defaultInterval);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setLastRefresh(new Date());
      setCountdown(interval);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, interval]);

  // Handle auto-refresh interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isEnabled && interval > 0) {
      intervalRef.current = setInterval(() => {
        refresh();
      }, interval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, interval, refresh]);

  // Handle countdown
  useEffect(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    if (isEnabled && interval > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) return interval;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isEnabled, interval]);

  const setIntervalValue = useCallback((value: number) => {
    setInterval_(value);
    setCountdown(value);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    interval,
    setInterval: setIntervalValue,
    isEnabled,
    setIsEnabled,
    toggle,
    lastRefresh,
    isRefreshing,
    refresh,
    countdown,
  };
}
