import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import BdcContainer from "./BdcContainer";
import {connect} from 'react-redux';
import { notes, menu } from '../../actions';

class Register extends Component {
    render() {
        return (
          <BdcContainer>
              <h1>Register</h1>
          </BdcContainer>
          )
    }
}

export default Register;