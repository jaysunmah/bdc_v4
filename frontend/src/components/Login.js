import React, {Component} from "react";
import {Button, Header, Image, Menu, Modal} from 'semantic-ui-react'
import {Link, Redirect} from "react-router-dom";
import {auth} from '../../actions';
import {connect} from "react-redux";

class Login extends Component {
  state = {
    username: "",
    "password": ""
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/"/>
    }
    return (
      <Modal trigger={
        <Menu.Item
          position='right'
        >
          Login
        </Menu.Item>
      }>
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <form onSubmit={this.onSubmit}>
            <fieldset>
              <legend>Login</legend>
              <p>
                <label htmlFor="username">Username</label>
                <input
                  type="text" id="username"
                  onChange={e => this.setState({username: e.target.value})} />
              </p>
              <p>
                <label htmlFor="password">Password</label>
                <input
                  type="password" id="password"
                  onChange={e => this.setState({password: e.target.value})} />
              </p>
              <p>
                <button type="submit">Login</button>
              </p>

              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </fieldset>
          </form>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => {
      return {field, message: state.auth.errors[field]};
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => {
      return dispatch(auth.login(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
