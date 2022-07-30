import { string } from 'https://esm.sh/v87/@types/prop-types@15.7.5/index.d.ts';
import React, { useReducer } from 'react';
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
  console.log("ふがふが　di store is ...");
  let instance: T;
  let isInstanceExist = false;

  const contextValue = React.useContext(DI_Context);
  console.log(contextValue);
  contextValue.forEach((value: { SUPPLYER: Supplyer<T>; }, index: any, array: any) => {
      // 既に指定した型のインスタンスが存在する場合はその型の既存のインスタンスを返す
      // 注: 返しません 毎回新しいインスタンスを作ったほうが効率がいい  7月27日
      // 注: やっぱり毎回インスタンスを作るのはやめた。コンストラクタの実行を一回だけにしたいから。 7月29日
      if(value.SUPPLYER == supplyer) {
          isInstanceExist = true;
          instance = value as T;
          instance.updateState();
      }
      /*
      if(value.TYPE == supplyer.TYPE) {
          return value;
      }
      */
  });
  // 指定した型のインスタンスが存在しない場合は新しいインスタンスを作る
  console.log("ふがふが instance");
  console.log(instance);
  if(isInstanceExist == false) {
    instance = supplyer.create() as T;
    DI_Store.push(instance);
    console.log(instance);
  }
  return instance as T;
}