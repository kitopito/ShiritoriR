import React, { useReducer } from 'react';
import { ReducerState, Dispatch} from 'react';
import { useMatchingReducer } from "./useMatchingReducer.ts";
import { useShiritoriReducer } from "./useShiritoriReducer.ts";
import { useRobotReducer } from "./useRobotReducer.ts";

export type stateUndDispatch = [ReducerState<any>, Dispatch<any>];

// 全部の値をstateUndDispatchにする
interface StoreState {
    shiritoriReducer: stateUndDispatch,
    matchingReducer: stateUndDispatch,
    robotReducer: stateUndDispatch,
}

const initialStoreState: StoreState = {
  shiritoriReducer: [{}, ()=>{}] as stateUndDispatch,
  matchingReducer: [{}, ()=>{}] as stateUndDispatch,
  robotReducer: [{}, ()=>{}] as stateUndDispatch,
};
  
const globalContext = React.createContext(initialStoreState);

export const StoreProvider = ({ children }) => {
  console.log("ほげほげ　store created");
  const [store, dispatch] = useShiritoriReducer();
  console.log(store);

  // Storeが変化した時だけリレンダリングするようuseMemoを使用
  /*
  const contextValue = useMemo(() => [store, dispatch],
    [store, dispatch]
  );
  */
  const contextValue: StoreState = {
    shiritoriReducer: [store, dispatch],
    matchingReducer: useMatchingReducer() as stateUndDispatch,
    robotReducer: useRobotReducer() as stateUndDispatch,
  };

  return (
    <globalContext.Provider value={contextValue}>
      { children }
    </globalContext.Provider>
  );
};

export function useStore() {
  console.log("ふがふが　store used");
  const contextValue = React.useContext(globalContext);
  console.log(contextValue.shiritoriReducer[0]);
//  return [contextValue[0], contextValue[1]];
//  return React.useContext(globalContext);

//  useContextで値を返すのは諦めた。
//  localhostでは実行できるがdeno deployではエラーになるためである。
//  多分stateの参照が死んでいるからだと思う。
  const kari: StoreState = {
    shiritoriReducer: useShiritoriReducer() as stateUndDispatch,
    matchingReducer: useMatchingReducer() as stateUndDispatch,
    robotReducer: useRobotReducer() as stateUndDispatch,
  };
  return kari;
}