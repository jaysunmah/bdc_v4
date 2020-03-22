export const getHeaderWithAuthToken = (getState) => {
  const token = getState().auth.token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`
  }
}