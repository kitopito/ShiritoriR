import React, { useReducer } from 'react';

//------------------------------------------------------------------------------
// enumの代わりにunionを使う書き方
export const RobotPageState = {
  LOADING: "loading",
  MYTURN: "myturn",
  ROBOTTURN: "robotturn",
  WIN: "win",
  LOSE: "lose",
} as const;

export type RobotPageState = typeof RobotPageState[keyof typeof RobotPageState];
//------------------------------------------------------------------------------

interface State {
  robotPageState: RobotPageState,
}
interface Action {
  type: string,
  data: RobotPageState,
}

const initialState: State = {
  robotPageState: RobotPageState.LOADING,
}

//const matchingContext = React.createContext(initialState);

const reducer = (state: State, action: Action) => {
  console.log("ふがふが　robot reducer working");
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CHANGE_ROBOT_PAGE_STATE':
      return {
        ...state,
        robotPageState: action.data,
      };
    default:
      return state;
  }
};

export function useRobotReducer() {
    console.log("ふがふが　Robot reducer used");
    const [store, dispatch] = useReducer(reducer, initialState);
    console.log(store);
    return [store, dispatch];
}