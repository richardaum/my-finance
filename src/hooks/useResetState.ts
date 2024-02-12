import { type Dispatch, type SetStateAction, useState } from "react";

// [state, setState, resetState]
export function useResetState<T>(initialState: T): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(initialState);

  const resetState = () => setState(initialState);

  return [state, setState, resetState];
}
