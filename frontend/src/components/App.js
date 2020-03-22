import React, { Component } from "react";
import { render } from "react-dom";
import {applyMiddleware, createStore} from "redux";
import { Provider } from "react-redux";
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import thunk from "redux-thunk";

import bdcApp from "../../reducers";
let store = createStore(bdcApp, applyMiddleware(thunk));

import Landing from "./Landing";
import Login from "./Login";
import TDAccountView from "./TDAccountView";
import NotFound from "./NotFound";

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
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/tdameritrade/account" component={TDAccountView} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
