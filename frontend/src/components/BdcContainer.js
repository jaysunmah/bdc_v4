import React, { Component } from 'react';
import BdcMenu from "./BdcMenu";
import { Container } from 'semantic-ui-react'

export default class BdcContainer extends Component {
  render() {
    return (
      <div>
        <BdcMenu></BdcMenu>
        <Container text>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
