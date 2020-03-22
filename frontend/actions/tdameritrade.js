import {getHeaderWithAuthToken} from "./helpers";

export const loadTDAccount = () => {
  return (dispatch, getState) => {
    let headers = getHeaderWithAuthToken(getState);
    fetch("/api/tdameritrade/account/", { headers, method: "GET" })
      .then(res => {
        if (res.status == 200) {
          return res.json();
        }
      })
      .then(data => {
        dispatch({ type: "LOADED_TD_ACCOUNT", account: data })
      });
  }
};

export const upsertTDAccount = (refresh_token, access_token, account_id, client_id) => {
  return (dispatch, getState) => {
    let headers = getHeaderWithAuthToken(getState);
    let body = JSON.stringify({ refresh_token, access_token, account_id, client_id });
    dispatch({ type: "UPDATING_TD_ACCOUNT" });
    fetch("/api/tdameritrade/account/", { headers, body, method: "POST" })
      .then(res => {
        if (res.status == 200) {
          return res.json()
        }
      })
      .then(data => {
        dispatch({ type: "UPDATED_TD_ACCOUNT", account: data })
      });
  }

}