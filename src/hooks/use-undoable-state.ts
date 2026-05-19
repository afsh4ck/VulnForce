import { useCallback, useRef, useState } from 'react';
import type { SetStateAction } from 'react';

export function useUndoableState<T>(initialValue: T) {
  const [state, setBaseState] = useState<T>(initialValue);
  const history = useRef<T[]>([initialValue]);
  const historyIndex = useRef(0);

  const pushHistory = useCallback((nextValue: T) => {
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }
    history.current.push(nextValue);
    historyIndex.current = history.current.length - 1;
  }, []);

  const setState = useCallback((action: SetStateAction<T>, saveToHistory = true) => {
    setBaseState(prevValue => {
      const nextValue = typeof action === 'function'
        ? (action as (prevState: T) => T)(prevValue)
        : action;

      if (saveToHistory && !Object.is(prevValue, nextValue)) {
        pushHistory(nextValue);
      }

      return nextValue;
    });
  }, [pushHistory]);

  const resetState = useCallback((nextValue: T) => {
    history.current = [nextValue];
    historyIndex.current = 0;
    setBaseState(nextValue);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex.current <= 0) return false;
    historyIndex.current -= 1;
    setBaseState(history.current[historyIndex.current]);
    return true;
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current >= history.current.length - 1) return false;
    historyIndex.current += 1;
    setBaseState(history.current[historyIndex.current]);
    return true;
  }, []);

  return { state, setState, resetState, undo, redo };
}
