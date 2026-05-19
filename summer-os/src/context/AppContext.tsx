import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from './types';
import { reducer, DEFAULT_STATE } from './reducer';
import { loadState, saveState } from '../utils/localStorage';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, () => {
    const saved = loadState();
    return saved ?? DEFAULT_STATE;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
