import React, { Component } from 'react'
import { connect } from "react-redux";
import { Menu, Loader, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import {auth, menu, tdameritrade} from "../../../actions";
import { AppBar, Tabs, Tab, Box, Typography } from "@material-ui/core";

class ProfileMenu extends Component {
  handleItemClick(dest){
    console.log(dest)
    this.props.selectItem(dest);
  };

  renderTda() {
    let tda = this.props.tdameritrade;
    if (tda.healthcheck === "loading") {
       return (<div> TD Ameritrade Profile <i className="sync loading icon"></i></div>)
    } else if (tda.healthcheck === "pass") {
      return (<div> TD Ameritrade Profile <Icon name="check circle" color = "green"/></div>)
    } else if (tda.healthcheck === "fail") {
      return (<div> TD Ameritrade Profile<Icon name="times circle" color = "red"/></div>)
    }
    return (<div> TD Ameritrade Profile </div>);

  }

  renderMenu() {
    const {active} = this.props.menu;
    let tdahealth = this.renderTda()
    return (
      <Tabs orientation="vertical" value={active}>
        <Tab
          label={'BDC Profile'}
          value={'/profile'}
          component={Link} 
          to={"/profile"}
          onClick={ () => this.handleItemClick('/profile')} 
        />
        <Tab
          label={tdahealth}
          value={'/profile/tdameritrade'}
          component={Link} 
          to={"/profile/tdameritrade"}
          onClick={ () => this.handleItemClick('/profile/tdameritrade')}
        />
        <Tab
          label={"Robinhood Profile"}
          value={'/profile/robinhood'}
          component={Link} 
          to={"/profile/robinhood"}
          onClick={ () => this.handleItemClick('/profile/robinhood')}
        />
         <Tab
          label={"Verify Accounts"}
          value={'/profile/verify'}
          onClick={ () => this.props.healthcheck()}
         />
         <Tab
          label={"Logout"}
          value={'/profile/logout'}
          onClick={ () => this.props.logout()}
          
         />
      </Tabs>
    );
  }

  render() {
    return (
      <AppBar position={"static"} color={"inherit"}>
      {this.renderMenu()}
      </AppBar>
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