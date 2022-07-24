import React, { useReducer, useMemo } from 'react';
import { useShiritoriReducer } from "./useShiritoriReducer.ts";

const globalContext = React.createContext(undefined);

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useShiritoriReducer();

  // Storeが変化した時だけリレンダリングするようuseMemoを使用
  /*
  const contextValue = useMemo(() => [store, dispatch],
    [store, dispatch]
  );
  */
  const contextValue = [store, dispatch];

  return (
    <globalContext.Provider value={contextValue}>
      { children }
    </globalContext.Provider>
  );
};

export function useStore() {
  const contextValue = React.useContext(globalContext);
  return [contextValue[0], contextValue[1]];
//  return React.useContext(globalContext);
}