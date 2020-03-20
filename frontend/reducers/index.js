import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import menu from "./menu";

const bdcApp = combineReducers({
  notes,
  auth,
  menu,
});

export default bdcApp;