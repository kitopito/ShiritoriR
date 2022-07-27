import React, { useReducer, useMemo} from 'react';
import { ReducerState, Dispatch} from 'react';
import { useShiritoriReducer } from "./useShiritoriReducer.ts";

export type stateUndDispatch = [ReducerState<any>, Dispatch<any>];

// 全部の値をstateUndDispatchにする
interface StoreState {
    shiritoriReducer: stateUndDispatch,
}

const initialStoreState: StoreState = {
  shiritoriReducer: [{}, ()=>{}] as stateUndDispatch,
};
  
const globalContext = React.createContext(initialStoreState);

export const StoreProvider = ({ children }) => {
  console.log("ほげほげ　store created");
  const [store, dispatch] = useShiritoriReducer();

  // Storeが変化した時だけリレンダリングするようuseMemoを使用
  /*
  const contextValue = useMemo(() => [store, dispatch],
    [store, dispatch]
  );
  */
  const contextValue: StoreState = {shiritoriReducer: [store, dispatch]};

  return (
    <globalContext.Provider value={contextValue}>
      { children }
    </globalContext.Provider>
  );
};

export function useStore() {
  console.log("ふがふが　store used");
//  const contextValue = React.useContext(globalContext);
//  return [contextValue[0], contextValue[1]];
  return React.useContext(globalContext);
}