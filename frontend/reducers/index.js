import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import menu from "./menu";
import tdameritrade from "./tdameritrade";

const bdcApp = combineReducers({
  notes,
  auth,
  menu,
  tdameritrade,
});

export default bdcApp;