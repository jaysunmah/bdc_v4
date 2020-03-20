const initialState = {
  active: "home"
}

export default function menu(state=initialState, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {...state, active: action.item};
    default:
      return state;
  }
}