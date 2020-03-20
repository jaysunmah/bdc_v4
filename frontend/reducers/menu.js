const initialState = {
  active: "home",
  isPrime: false,
}

export default function menu(state=initialState, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {...state, active: action.item};
    case 'IS_PRIME_RES':
      return {...state, isPrime: action.res };
    default:
      return state;
  }
}