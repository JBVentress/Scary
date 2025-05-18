import { useEffect, useRef } from 'react';
import { useLovePoints } from '@/lib/stores/useLovePoints';
import { useClickGame } from '@/lib/stores/useClickGame';

/**
 * AutoClicker component that generates automatic clicks
 * based on purchased upgrades. It will trigger clicks at a rate
 * determined by the autoClicksPerSecond value from the useLovePoints store.
 */
export default function AutoClicker() {
  const { autoClicksPerSecond } = useLovePoints();
  const { registerClick } = useClickGame();
  const lastClickTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Don't set up interval if there are no auto clicks
    if (autoClicksPerSecond <= 0) return;
    
    // Calculate interval in ms based on clicks per second
    const intervalMS = 1000 / autoClicksPerSecond;
    
    const autoClickInterval = setInterval(() => {
      const now = Date.now();
      registerClick(now);
      lastClickTimeRef.current = now;
    }, intervalMS);
    
    // Clean up interval on unmount
    return () => clearInterval(autoClickInterval);
  }, [autoClicksPerSecond, registerClick]);
  
  // Render nothing - this is a behavior-only component
  return null;
}