import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";

const bdcApp = combineReducers({
  notes,
  auth,
});

export default bdcApp;