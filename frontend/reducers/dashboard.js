const initialState = {
  portfolios: {},
  positions: [],
  loaded_portfolios: false,
  loaded_positions: false,
  status: "Loading portfolio info..."
}

export default function dashboard(state=initialState, action) {
  switch(action.type) {
    case 'LOADED_PORTFOLIOS':
      return {...state, loaded_portfolios: true, portfolios: action.portfolios , status: "loaded portfolios"};
    case 'LOADED_POSITIONS':
      return {...state, loaded_positions: true, positions: action.positions, status: "loaded positions"};
    case 'ERROR':
      return {...state, status: action.error_message };
    default:
      return state;
  }
}