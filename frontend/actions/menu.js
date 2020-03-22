export const selectItem = (item) => {
  return (dispatch) => {
    dispatch({ type: "SELECT_ITEM", item });
  }
};

export const checkIsPrime = num => {
  return (dispatch) => {
    let headers = {"Content-Type": "application/json"};
    let body = JSON.stringify({ num });
    return fetch("/api/tdameritrade/helloworld/", { headers, body, method: "POST"})
      .then(res => {
        return res.json().then(data => {
          dispatch({type: "IS_PRIME_RES", res: data.res})
        })
      })
  }
}