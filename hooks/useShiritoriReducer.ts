import React, { useReducer, useMemo } from 'react';

const initialState: State = {
  nextWordInput: '',
  previousWord: 'しりとり',
  wordHistory: ['しりとり'] as Array<string>,
}

const shiritoriContext = React.createContext(initialState);

interface State {
  nextWordInput: string,
  previousWord: string,
  wordHistory: Array<string>,
}
interface Action {
  type: string,
  data: string,
  field: string,
}

const reducer = (state: State, action: Action) => {
  console.log("ふがふが　reducer working");
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CHANGE_VALUE':
      return {
        ...state,
        [action.field]: action.data,
      };
    case 'ADD_WORD_HISTORY':
      state.wordHistory.push(action.data);
      return {
        ...state,
        wordHistory: state.wordHistory,
      }
    default:
      return state;
  }
};

export function useShiritoriReducer() {
    console.log("ふがふが　shiritori reducer used");
    const [store, dispatch] = useReducer(reducer, initialState);
    console.log(store);
    return [store, dispatch];
}