const initialState = {
  portfolios: {},
  positions: [],
  orders: [],
  transfers: [],
  loaded_portfolios: false,
  loaded_positions: false,
  loaded_orders: false,
  loaded_transfers: false,
  selected_portfolio: undefined,
  selected_portfolio_id: -1,
  status: "Loading portfolio info...",
  deleting_portfolio: false,
  saving_portfolio: false,
  processing_transfer: false
}

export default function dashboard(state=initialState, action) {
  switch(action.type) {
    case 'LOADED_PORTFOLIOS':
      return {...state, loaded_portfolios: true, portfolios: action.portfolios , status: "loaded portfolios"};
    case 'LOADED_POSITIONS':
      return {...state, loaded_positions: true, positions: action.positions, status: "loaded positions"};
    case 'LOADED_ORDERS':
      return {...state, loaded_orders: true, orders: action.orders, status: "loaded orders"};
    case 'LOADED_TRANSFERS':
      return {...state, loaded_transfers: true, transfers: action.transfers, status: "loaded transfers"};
    case 'SELECT_PORTFOLIO':
      let portfolios = state['portfolios'];
      let selected_portfolio = portfolios[action.port_id];
      return {...state, selected_portfolio, selected_portfolio_id: action.port_id };
    case 'DELETING_PORTFOLIO':
      return {...state, deleting_portfolio: true };
    case 'DELETED_PORTFOLIO':
      return {...state, deleting_portfolio: false, portfolios: action.portfolios, selected_portfolio_id: -1, selected_portfolio: undefined};
    case 'SAVING_PORTFOLIO':
      return {...state, saving_portfolio: true};
    case 'SAVED_PORTFOLIO':
      portfolios = state['portfolios'];
      const { new_portfolio, port_id } = action;
      portfolios[port_id] = new_portfolio;
      selected_portfolio = new_portfolio;
      let selected_portfolio_id = port_id;
      return {...state, saving_portfolio: false, portfolios , selected_portfolio_id, selected_portfolio };
    case 'SAVED_TRANSFER':
    case 'DELETED_TRANSFER':
    case 'EDITED_TRANSFER':
      return {...state, transfers: action.transfers, processing_transfer: false };
    case 'SAVING_TRANSFER':
    case 'DELETING_TRANSFER':
    case 'EDITING_TRANSFER':
      return {...state, processing_transfer: true};
    case 'ERROR':
      return {...state, status: action.error_message, saving_portfolio: false, deleting_portfolio: false };
    default:
      return state;
  }
}