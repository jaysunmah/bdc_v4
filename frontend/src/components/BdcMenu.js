import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { auth, menu } from '../../actions';

class BdcMenu extends Component {
  state = {};
  handleItemClick = (e, { name }) => {
    this.props.selectItem(name);
  };

  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const { activeItem } = this.state

    let loginLogoutMenuItem = (
      <Menu.Item
        position='right'
        as={Link} to="/login"
      >
        Login
      </Menu.Item>
    );
    if (this.props.auth.isAuthenticated) {
      loginLogoutMenuItem = (
        <Menu.Item
          position='right'
          onClick={this.props.logout}
        >
          Logout
        </Menu.Item>
      );
    }

    return (
        <Menu>
          <Menu.Item
            name='home'
            active={this.props.menu.active === 'home'}
            onClick={this.handleItemClick}
            as={Link} to="/"
          >
            Home
          </Menu.Item>

          <Menu.Item
            name='reviews'
            active={this.props.menu.active === 'reviews'}
            onClick={this.handleItemClick}
            as={Link} to="/reviews"
          >
            Reviews
          </Menu.Item>

          <Menu.Item
            name='people'
            active={this.props.menu.active === 'people'}
            onClick={this.handleItemClick}
            as={Link} to="/people"
          >
            Upcoming Events
          </Menu.Item>

          {loginLogoutMenuItem}
        </Menu>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    menu: state.menu,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
    },
    login: (username, password) => {
      return dispatch(auth.login(username, password));
    },
    logout: () => dispatch(auth.logout()),
    selectItem: (item) => {
      return dispatch(menu.selectItem(item))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BdcMenu);