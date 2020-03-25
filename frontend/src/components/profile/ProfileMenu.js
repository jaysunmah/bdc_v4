import React, { Component } from 'react'
import { connect } from "react-redux";
import { Menu, Loader, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import {auth, menu, tdameritrade} from "../../../actions";

class ProfileMenu extends Component {
  handleItemClick = (e, { to }) => {
    this.props.selectItem(to);
  };

  render() {
    let tda = this.props.tdameritrade;
    let tdahealth = null;
    if (tda.healthcheck === "loading") {
      tdahealth = <i className="sync loading icon"></i>
    } else if (tda.healthcheck === "pass") {
      tdahealth = <Icon name="check circle" color = "green"/>
    } else if (tda.healthcheck === "fail") {
      tdahealth = <Icon name="times circle" color = "red"/>
    }
    return (
      <Menu vertical tabular>
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
          TD Ameritrade Profile {tdahealth}
        </Menu.Item>
        <Menu.Item
          active={this.props.menu.active === "/profile/robinhood"}
          as={Link} to={"/profile/robinhood"}
          onClick={this.handleItemClick}
        >
          Robinhood Profile
        </Menu.Item>
        <Menu.Item
          onClick={() => this.props.healthcheck()}
        >
          Verify Accounts
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
    tdameritrade: state.tdameritrade

  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(auth.logout());
      dispatch(tdameritrade.resetTDAccount());
    },
    selectItem: (item) => {
      dispatch(menu.selectItem(item))
    },
    healthcheck: () => {
      dispatch(tdameritrade.healthcheckTD())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);