import React, { Component } from "react";
import { render } from "react-dom";
import {applyMiddleware, createStore} from "redux";
import { Provider } from "react-redux";
import {Route, Switch, Router} from 'react-router-dom';
import thunk from "redux-thunk";
import history from './history';

import bdcApp from "../../reducers";
let store = createStore(bdcApp, applyMiddleware(thunk));

import Landing from "./Landing";
import Login from "./Login";
import TDAccountView from "./profile/TDAccountView";
import NotFound from "./NotFound";
import Profile from "./profile/Profile";
import Dashboard from "./Dashboard";
import Register from "./Register";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile/tdameritrade" component={TDAccountView} />
            <Route exact path={"/profile"} component={Profile} />
            <Route exact path={"/dashboard"} component={Dashboard} />
            <Route exact path={"/register"} component={Register} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
