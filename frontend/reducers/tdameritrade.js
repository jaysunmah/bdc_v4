const initialState = {
  account: {},
  loaded: false,
  status: "No TD Account linked for user"
}

export default function tdameritrade(state=initialState, action) {
  switch(action.type) {
    case 'LOADED_TD_ACCOUNT':
      return {...state, loaded: true, account: action.account, status: "loaded td account details"};
    case 'UPDATED_TD_ACCOUNT':
      return {...state, loaded: true, account: action.account, status: "successfully updated td account details!"};
    case 'UPDATING_TD_ACCOUNT':
      return {...state, status: "updating td account details..."};
    default:
      return state;
  }
}