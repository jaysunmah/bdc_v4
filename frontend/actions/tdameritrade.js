import {getHeaderWithAuthToken} from "./helpers";

export const loadTDAccount = () => {
  return (dispatch, getState) => {
    let headers = getHeaderWithAuthToken(getState);
    fetch("/api/tdameritrade/account/", { headers, method: "GET" })
      .then(res => {
        if (res.status == 200) {
          return res.json();
        } else if (res.status == 401) {
          throw "User is not logged in, so no td account is linked"
        }
        throw "Internal server in getting account details";
      })
      .then(data => {
        if (data.error) {
          dispatch({ type: "ERROR", error_message: data.error });
        } else {
          dispatch({ type: "LOADED_TD_ACCOUNT", account: data });
        }
      })
      .catch(e => {
        dispatch({ type: "ERROR", error_message: e })
      });
  }
};

export const upsertTDAccount = (account) => {
  return (dispatch, getState) => {
    let headers = getHeaderWithAuthToken(getState);
    let body = JSON.stringify(account);
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

export const resetTDAccount = () => {
  return (dispatch) => {
    dispatch({ type: "RESET_TD_ACCOUNT" });
  }
}

export const editTDAccount = (account) => {
  return (dispatch) => {
    dispatch({ type: "EDIT_TD_ACCOUNT", account });
  }
}