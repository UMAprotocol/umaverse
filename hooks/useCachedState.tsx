import { useState, useEffect, Dispatch, SetStateAction } from "react";

const stateMap = new Map();

/* This hook is used to cache state between mount/umount of the same component 
  It is meant to be used for things that are specific to one component only but have to be persisted between unmounts (table filters after a page transition for example). 
*/
export function useCachedState<T = unknown>(
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(stateMap.get(key));

  useEffect(() => {
    stateMap.set(key, state);
  }, [key, state]);
  return [state, setState];
}
