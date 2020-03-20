import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import BdcContainer from "./BdcContainer";

export default class Landing extends Component {
    render() {
        return (
          <BdcContainer>
              <h1>Blue Dress Capital</h1>
              <Link to={"/contact"}> click here</Link> to contact us.
          </BdcContainer>
        );
    }
}