import {getHeaderWithAuthToken} from "./helpers";

let fetchWrapper = (dispatch, getState, method, url, body, cb) => {
  let headers = getHeaderWithAuthToken(getState);
  body = JSON.stringify(body);
  let payload = body === "{}" ? { headers, method } : { headers, method, body };
  fetch(url, payload)
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
    fetchWrapper(dispatch, getState, "GET", "/api/bdc/portfolio/",{}, (data) => {
      dispatch({ type: "LOADED_PORTFOLIOS", portfolios: data });
    });
  }
};

export const loadAllPositions = () => {
  return (dispatch, getState) => {
    fetchWrapper(dispatch, getState, "GET", "/api/bdc/positions/", {}, (data) => {
      dispatch({ type: "LOADED_POSITIONS", positions: data });
    });
  }
}

export const loadAllOrders = () => {
  return (dispatch, getState) => {
    fetchWrapper(dispatch, getState, "GET", "/api/bdc/orders/", {}, (data) => {
      dispatch({ type: "LOADED_ORDERS", orders: data });
    });
  }
}

export const loadAllTransfers = () => {
  return (dispatch, getState) => {
    fetchWrapper(dispatch, getState, "GET", "/api/bdc/transfers/", {}, (data) => {
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

export const uuidv4 = () => {
  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const savePortfolio = (nickname, brokerage) => {
  return (dispatch, getState) => {
    dispatch({ type: "SAVING_PORTFOLIO" });
    const token = getState().auth.token;
    let uid = uuidv4();
    let portSocket = new WebSocket("ws://" + window.location.host + "/ws/bdc/save_portfolio/" + uid + "/");

    portSocket.onmessage = function(e) {
      const { message, status, new_portfolio, port_id }= JSON.parse(e.data);
      if (status === 'done') {
        portSocket.close();
        loadAllOrders()(dispatch, getState);
        loadAllPositions()(dispatch, getState);
        loadAllTransfers()(dispatch, getState);
        dispatch({ type: "SAVED_PORTFOLIO", new_portfolio, port_id });
      } else if (status == 'error') {
        dispatch({ type: "ERROR", error_message: message })
      } else {
        dispatch({ type: 'SAVING_PORTFOLIO_UPDATE', message });
      }
    };

    portSocket.onclose = function(e) {
      console.log('web socket closed');
    };

    portSocket.onopen = (e) => {
      portSocket.send(JSON.stringify({ token, nickname, brokerage}));
    }
  }
}

export const saveTransfer = ({ date, action, amount, brokerage }) => {
  return (dispatch, getState) => {
    dispatch({ type: "SAVING_TRANSFER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/transfers/manual/save/", {
      date, action, amount, brokerage
    }, (data) => {
      dispatch({ type: "SAVED_TRANSFER", transfers: data })
    });
  }
}

export const deleteTransfer = (uid) => {
  return (dispatch, getState) => {
    dispatch({ type: "DELETING_TRANSFER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/transfers/manual/delete/", {
      uid
    }, (data) => {
      dispatch({ type: "DELETED_TRANSFER", transfers: data })
    })
  }
}

export const editTransfer = (uid, { date, action, amount }) => {
  return (dispatch, getState) => {
    dispatch({ type: "EDITING_TRANSFER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/transfers/manual/edit/", {
      uid, date, action, amount
    }, (data) => {
      dispatch({ type: "EDITED_TRANSFER", transfers: data })
    })
  }
}

export const saveOrder = (brokerage, { action, stock, quantity, price, date }) => {
  return (dispatch, getState) => {
    dispatch({ type: "SAVING_ORDER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/orders/manual/save/", {
      brokerage, action, stock, quantity, price, date
    }, (data) => {
      dispatch({ type: "SAVED_ORDER", orders: data })
    })
  }
}

export const deleteOrder = (uid) => {
  return (dispatch, getState) => {
    dispatch({ type: "DELETING_ORDER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/orders/manual/delete/", {
      uid
    }, (data) => {
      dispatch({ type: "DELETED_ORDER", orders: data })
    })
  }
}

export const editOrder = (uid, { action, stock, quantity, price, date }) => {
  return (dispatch, getState) => {
    dispatch({ type: "EDITING_ORDER" });
    return fetchWrapper(dispatch, getState, "POST", "/api/bdc/orders/manual/edit/", {
      uid, stock, action, quantity, price, date
    }, (data) => {
      dispatch({ type: "EDITED_ORDER", orders: data })
    })
  }
}