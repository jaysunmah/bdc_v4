import React, { Component } from 'react'
import { connect } from "react-redux";
import { Menu } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import {auth, menu, tdameritrade} from "../../../actions";

class ProfileMenu extends Component {
  handleItemClick = (e, { to }) => {
    this.props.selectItem(to);
  };

  render() {
    return (
      <Menu fluid vertical tabular>
        <Menu.Item
          active={this.props.menu.active === "/profile"}
          as={Link} to={"/profile"}
          onClick={this.handleItemClick}
        >
          BDC Profile
        </Menu.Item>
        <Menu.Item
          active={this.props.menu.active === "/profile/tdameritrade"}
          as={Link} to={"/profile/tdameritrade"}
          onClick={this.handleItemClick}
        >
          TD Ameritrade Profile
        </Menu.Item>
        <Menu.Item
          onClick={() => this.props.logout()}
        >
          Logout
        </Menu.Item>
      </Menu>
    )

  }
}

const mapStateToProps = state => {
  return {
    menu: state.menu,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(auth.logout());
      dispatch(tdameritrade.resetTDAccount());
    },
    selectItem: (item) => {
      return dispatch(menu.selectItem(item))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);