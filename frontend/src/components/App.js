import React, { Component } from "react";
import { render } from "react-dom";
import { Container, Header } from 'semantic-ui-react';
import BdcMenu from './Menu';

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
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {
    return (
        <div>
          <BdcMenu></BdcMenu>
          <Container text>
            <Header as='h2'>Blue Dress Capital</Header>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
              ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
              ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
              quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
              arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
              dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
              Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
              Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
              viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
              Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
              ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
              ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
              quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
              arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
              dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
              Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
              Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
              viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
              Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
            </p>
          </Container>
        </div>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
