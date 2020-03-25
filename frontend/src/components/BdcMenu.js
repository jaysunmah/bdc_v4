import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {auth, menu, tdameritrade} from '../../actions';
import Dashboard from "./Dashboard";


class BdcMenu extends Component {
  state = {};
  handleItemClick = (e, { to }) => {
    this.props.selectItem(to);
  };

  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    let loginLogoutMenuItem = (
      <Menu.Item
        position='right'
        as={Link} to="/login"
      >
        Login
      </Menu.Item>
    );
    let dashboardMenuItem = "";

    if (this.props.auth.isAuthenticated) {
      loginLogoutMenuItem = (
        <Menu.Menu position='right'>
        <Dropdown item icon='user' simple>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link} to={"/profile"}
            onClick={this.handleItemClick}
            active={this.props.menu.active.includes("/profile")}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => this.props.logout()}
            >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </Menu.Menu>
      );
      dashboardMenuItem = (
        <Menu.Item
          as={Link} to={"/dashboard"}
          onClick={this.handleItemClick}
          active={this.props.menu.active === "/dashboard"}
        >
          Dashboard
        </Menu.Item>
      );
    }

    return (
      <Menu>
        <Menu.Item
          active={this.props.menu.active === '/'}
          onClick={this.handleItemClick}
          as={Link} to="/"
        >
          Home
        </Menu.Item>

        <Menu.Item
          active={this.props.menu.active === '/reviews'}
          onClick={this.handleItemClick}
          as={Link} to="/reviews"
        >
          Reviews
        </Menu.Item>
        {dashboardMenuItem}

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
    selectItem: (item) => {
      return dispatch(menu.selectItem(item))
    },
    logout: () => {
      dispatch(auth.logout());
      dispatch(tdameritrade.resetTDAccount());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BdcMenu);