import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage entrance phases:
 * - "armed": component is mounted and waiting to play (content hidden/masked)
 * - "play": animation is actively running
 * - "static": animation has finished or user prefers reduced motion
 */
export function useEntrance({ trigger = "load", once = true, play } = {}) {
  const [phase, setPhase] = useState(() => {
    if (play !== undefined) return play ? "play" : "armed";
    if (trigger === "load") return "play";
    return "armed";
  });

  const nodeRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (play !== undefined) {
      if (play) {
        setPhase("play");
        playedRef.current = true;
      } else if (!once || !playedRef.current) {
        setPhase("armed");
      }
      return;
    }

    if (trigger === "load") {
      setPhase("play");
      playedRef.current = true;
      return;
    }

    if (trigger === "in-view" && nodeRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPhase("play");
          playedRef.current = true;
          if (once) observer.disconnect();
        } else if (!once) {
          setPhase("armed");
        }
      });
      observer.observe(nodeRef.current);
      return () => observer.disconnect();
    }
  }, [trigger, once, play]);

  const setNode = useCallback((node) => {
    nodeRef.current = node;
  }, []);

  return [setNode, phase];
}

export default useEntrance;
