const initialState = {
  account: {
    refresh_token: "",
    access_token: "",
    account_id: "",
    client_id: ""
  },
  loaded: false,
  status: "Loading td account info..."
}

export default function tdameritrade(state=initialState, action) {
  switch(action.type) {
    case 'EDIT_TD_ACCOUNT':
      return {...state, account: action.account, status: "unsaved td account details"};
    case 'LOADED_TD_ACCOUNT':
      return {...state, loaded: true, account: action.account, status: "loaded td account details"};
    case 'UPDATED_TD_ACCOUNT':
      return {...state, loaded: true, account: action.account, status: "successfully updated td account details!"};
    case 'UPDATING_TD_ACCOUNT':
      return {...state, status: "updating td account details..."};
    case 'ERROR':
      return {...state, status: action.error_message };
    case 'RESET_TD_ACCOUNT':
      return initialState;
    default:
      return state;
  }
}