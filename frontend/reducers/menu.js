const initialState = {
  active: location.pathname,
  isPrime: false,
}

export default function menu(state=initialState, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {...state, active: action.item};
    case 'IS_PRIME_UPDATE':
      return {...state, isPrime: action.status };
    case 'IS_PRIME_RES':
      return {...state, isPrime: action.res };
    default:
      return state;
  }
}