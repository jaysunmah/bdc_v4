export const selectItem = (item) => {
  return (dispatch) => {
    dispatch({ type: "SELECT_ITEM", item });
  }
};