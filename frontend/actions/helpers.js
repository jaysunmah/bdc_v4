export const getHeaderWithAuthToken = (getState) => {
  const token = getState().auth.token;
  if (token == null) {
    throw "Unauthorized user";
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`
  }
}