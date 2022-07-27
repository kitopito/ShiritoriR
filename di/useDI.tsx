import { string } from 'https://esm.sh/v87/@types/prop-types@15.7.5/index.d.ts';
import React, { useReducer, useMemo } from 'react';
import { DependencyInjectable } from './DependencyInjectable.ts';
import { Supplyer } from './supplyer.ts';

const DI_Context = React.createContext([] as Array<DependencyInjectable>);

const DI_Store: Array<DependencyInjectable> = [] as Array<DependencyInjectable>;

export const DI_Provider = ({ children }) => {
  console.log("ほげほげ　di provider created");
  const contextValue = DI_Store;

  return (
    <DI_Context.Provider value={contextValue}>
      { children }
    </DI_Context.Provider>
  );
};

export function useDI<T extends DependencyInjectable>(supplyer: Supplyer<T>): T {
  console.log("ふがふが　di used");
  const contextValue = React.useContext(DI_Context);
  contextValue.forEach((value: { SUPPLYER: Supplyer<T>; }, index: any, array: any) => {
      // 既に指定した型のインスタンスが存在する場合はその型の既存のインスタンスを返す
      // 注: 返しません 毎回新しいインスタンスを作ったほうが効率がいい
      if(value.SUPPLYER == supplyer) {
//          return value as T;
      }
      /*
      if(value.TYPE == supplyer.TYPE) {
          return value;
      }
      */
  });
  // 指定した型のインスタンスが存在しない場合は新しいインスタンスを作る
  const instance = supplyer.create() as T;
//  DI_Store.push(instance);
  return instance;
}