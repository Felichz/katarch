import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives a scene through numbered phases on a timer.
 * With reduced motion it jumps straight to the last phase and stays there.
 */
export function usePhases(count: number, { interval = 1400, loop = false, reduced = false, auto = true, key = '' } = {}) {
  const [phase, setPhase] = useState(reduced ? count - 1 : 0);
  const [playing, setPlaying] = useState(auto && !reduced);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setPhase(reduced ? count - 1 : 0);
    setPlaying(auto && !reduced);
  }, [key, count, reduced, auto]);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setTimeout(() => {
      setPhase((p) => {
        if (p + 1 < count) return p + 1;
        if (loop) return 0;
        setPlaying(false);
        return p;
      });
    }, interval);
    return () => window.clearTimeout(timer.current);
  }, [phase, playing, interval, count, loop]);

  const replay = useCallback(() => {
    setPhase(0);
    setPlaying(true);
  }, []);
  const goTo = useCallback((p: number) => {
    setPlaying(false);
    setPhase(Math.max(0, Math.min(count - 1, p)));
  }, [count]);

  return { phase, playing, setPlaying, replay, goTo };
}
