import React, { useReducer } from 'react';

//------------------------------------------------------------------------------
// enumの代わりにunionを使う書き方
export const MatchingState = {
  MATCHING: "matching",
  MYTURN: "myturn",
  OPPONENTTURN: "opponentturn",
  WIN: "win",
  LOSE: "lose",
} as const;

export type MatchingState = typeof MatchingState[keyof typeof MatchingState];
//------------------------------------------------------------------------------

interface State {
  matchingState: MatchingState,
  myUserId: string,
  roomId: string,
}
interface Action {
  type: string,
  data: any,
}

const initialState: State = {
  matchingState: MatchingState.MATCHING,
  myUserId: '',
  roomId: '',
}

//const matchingContext = React.createContext(initialState);

const reducer = (state: State, action: Action) => {
  console.log("ふがふが　matching reducer working");
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CHANGE_MATCHIG_STATE':
      return {
        ...state,
        matchingState: action.data,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        myUserId: action.data,
      };
    case 'SET_ROOM_ID':
      return {
        ...state,
        roomId: action.data,
      };
    default:
      return state;
  }
};

export function useMatchingReducer() {
    console.log("ふがふが　matching reducer used");
    const [store, dispatch] = useReducer(reducer, initialState);
    console.log(store);
    return [store, dispatch];
}