import { combineReducers } from 'redux';
import notes from "./notes";


const bdcApp = combineReducers({
  notes,
});

export default bdcApp;