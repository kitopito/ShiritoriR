import { useReducer } from 'react'

const initialState: State = {
  nextWordInput: '',
  previousWord: 'しりとり',
}

interface State {
  nextWordInput: string,
  previousWord: string,
}
interface Action {
  type: string,
  data: string,
  field: string,
}

const reducer = (state: State, action: Action) => {
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CHANGE_VALUE':
      return {
        ...state,
        [action.field]: action.data,
      };
    default:
      return state;
  }
};

export function useShiritoriReducer() {
    const [store, dispatch] = useReducer(reducer, initialState);
    return [store, dispatch];
}