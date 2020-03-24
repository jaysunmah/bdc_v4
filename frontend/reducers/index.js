import { combineReducers } from 'redux';
import notes from "./notes";
import auth from "./auth";
import menu from "./menu";
import tdameritrade from "./tdameritrade";
import dashboard from "./dashboard"

const bdcApp = combineReducers({
  notes,
  auth,
  menu,
  tdameritrade,
  dashboard
});

export default bdcApp;