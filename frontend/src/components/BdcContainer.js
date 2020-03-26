import React, { Component } from 'react';
import BdcMenu from "./BdcMenu";
import Container from '@material-ui/core/Container';

export default class BdcContainer extends Component {
  render() {
    return (
      <div>
        <BdcMenu></BdcMenu>
        <br></br>
        <Container >
          {this.props.children}
        </Container>
      </div>
    );
  }
}
