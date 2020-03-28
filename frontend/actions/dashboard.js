import {getHeaderWithAuthToken} from "./helpers";

let fetchGetWrapper = (dispatch, getState, url, cb) => {
  let headers = getHeaderWithAuthToken(getState);
  return fetch(url, { headers, method: "GET" })
    .then(res => {
      if (res.status === 200) {
        return res.json()
      }
      throw "Internal server in getting account details";
    })
    .then(data => {
      if (data.error) {
        dispatch({ type: "ERROR", error_message: data.error });
      } else {
        cb(data)
      }
    })
    .catch(e => {
      dispatch({ type: "ERROR", error_message: e });
    })
}

export const loadAllPortfolios = () => {
  return (dispatch, getState) => {
    return fetchGetWrapper(dispatch, getState, "/api/bdc/portfolio/", (data) => {
      dispatch({ type: "LOADED_PORTFOLIOS", portfolios: data });
    });
  }
};

export const loadAllPositions = () => {
  return (dispatch, getState) => {
    return fetchGetWrapper(dispatch, getState, "/api/bdc/positions/", (data) => {
      dispatch({ type: "LOADED_POSITIONS", positions: data });
    });
  }
}

export const loadAllOrders = () => {
  return (dispatch, getState) => {
    return fetchGetWrapper(dispatch, getState, "/api/bdc/orders/", (data) => {
      dispatch({ type: "LOADED_ORDERS", orders: data });
    });
  }
}

export const loadAllTransfers = () => {
  return (dispatch, getState) => {
    return fetchGetWrapper(dispatch, getState, "/api/bdc/transfers/", (data) => {
      dispatch({ type: "LOADED_TRANSFERS", transfers: data })
    });
  }
}

export const selectPortfolio = (port_id) => {
  return (dispatch) => {
    dispatch({ type: "SELECT_PORTFOLIO", port_id })
  }
}

export const deletePortfolio = (port_id) => {
  return (dispatch, getState) => {
    dispatch({ type: "DELETING_PORTFOLIO" });
    let headers = getHeaderWithAuthToken(getState);
    let body = JSON.stringify({ portfolio_id: port_id });
    fetch("/api/bdc/portfolio/delete/", { headers, method: "POST", body })
      .then(res=> {
        if (res.status == 200) {
          return res.json()
        }
        throw "Internal server error in getting orders"
      })
      .then(data => {
        if (data.error) {
          dispatch({ type: "ERROR", error_message: data.error});
        } else {
          dispatch({ type: "DELETED_PORTFOLIO", portfolios: data });
          loadAllOrders()(dispatch, getState);
          loadAllPositions()(dispatch, getState);
          loadAllTransfers()(dispatch, getState);
        }
      })
      .catch(e => {
        dispatch({ type: "ERROR", error_message: e })
      })
  }
}

export const savePortfolio = (name, type) => {
  return (dispatch, getState) => {
    dispatch({ type: "SAVING_PORTFOLIO" });
    let headers = getHeaderWithAuthToken(getState);
    let body = JSON.stringify({ nickname: name, brokerage: type });
    fetch("/api/bdc/portfolio/", { headers, method: "POST", body })
      .then(res => {
        if (res.status == 200) {
          return res.json()
        }
        throw "Internal server error in getting orders"

      })
      .then(data => {
        if (data.error) {
          dispatch({ type: "ERROR", error_message: data.error});
        } else {
          dispatch({ type: "SAVED_PORTFOLIO", new_portfolio: data.new_portfolio, port_id: data.port_id });
          loadAllOrders()(dispatch, getState);
          loadAllPositions()(dispatch, getState);
          loadAllTransfers()(dispatch, getState);
        }
      })
      .catch(e => {
        dispatch({ type: "ERROR", error_message: e })
      })
  }
}

export const saveTransfer = (date, action, amount, type) => {
  return (dispatch, getState) => {
    dispatch({ type: "SAVING_TRANSFER" });
    let headers = getHeaderWithAuthToken(getState);
    let body = JSON.stringify({});
  }
}

