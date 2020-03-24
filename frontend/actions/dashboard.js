import {getHeaderWithAuthToken} from "./helpers";

export const loadAllPortfolios = () => {
  return (dispatch, getState) => {
    let headers = getHeaderWithAuthToken(getState);
    fetch("/api/bdc/portfolio/", { headers, method: "GET" })
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
          dispatch({ type: "LOADED_PORTFOLIOS", account: data });
        }
      })
      .catch(e => {
        dispatch({ type: "ERROR", error_message: e })
      });
  }
};