const initialState = {
  data: {},
  loaded: false,
  status: "Loading portfolio info..."
}

export default function dashboard(state=initialState, action) {
  switch(action.type) {
    case 'LOADED_PORTFOLIOS':
      return {...state, loaded: true, account: action.account, status: "loaded portfolios"};
    case 'ERROR':
      return {...state, status: action.error_message };
    default:
      return state;
  }
}