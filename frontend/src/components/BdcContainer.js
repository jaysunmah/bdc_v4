import React, { Component } from 'react';
import BdcMenu from "./BdcMenu";
import { Container, Divider, Box } from '@material-ui/core';

export default class BdcContainer extends Component {
  render() {
    return (
      <div>
        <BdcMenu></BdcMenu>
        <br></br>
        <Container >
          {this.props.children}
          <br/>
          <Divider />
          <Box p={3}>
            Blue Dress Capital LLC 2020
          </Box>
        </Container>

      </div>
    );
  }
}
