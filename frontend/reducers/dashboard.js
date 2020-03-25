const initialState = {
  portfolios: {},
  positions: [],
  loaded_portfolios: false,
  loaded_positions: false,
  selected_portfolio: undefined,
  selected_portfolio_id: -1,
  status: "Loading portfolio info..."
}

export default function dashboard(state=initialState, action) {
  switch(action.type) {
    case 'LOADED_PORTFOLIOS':
      return {...state, loaded_portfolios: true, portfolios: action.portfolios , status: "loaded portfolios"};
    case 'LOADED_POSITIONS':
      return {...state, loaded_positions: true, positions: action.positions, status: "loaded positions"};
    case 'SELECT_PORTFOLIO':
      let portfolios = state['portfolios'];
      let selected_portfolio = portfolios[action.port_id];
      return {...state, selected_portfolio, selected_portfolio_id: action.port_id };
    case 'ERROR':
      return {...state, status: action.error_message };
    default:
      return state;
  }
}