import React, { Component } from "react";
import { render } from "react-dom";
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Landing from "./Landing";
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
  componentDidMount() {
    fetch("api/lead")
      .then(response => {
        console.log(response);
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json()
      })
      .then(data => {
        console.log("data!", data);
      });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/yolo" component={Landing} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
