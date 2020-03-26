import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {auth, menu, tdameritrade} from '../../actions';
import Dashboard from "./Dashboard";
import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

class BdcMenu extends Component {
  state = {};
  handleItemClick = (e, { to }) => {
    this.props.selectItem(to);
  };

  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const { classes } = this.props;
    let loginLogoutMenuItem = (
      <Button component={ Link } to="/login" color="inherit">Login</Button>
    );
    let dashboardMenuItem = "";

    if (this.props.auth.isAuthenticated) {
      loginLogoutMenuItem = (
        <Button component={ Link } to="/profile" color="inherit">Profile</Button>
      );
      dashboardMenuItem = (
        <Button component={ Link } to="/dashboard" color="inherit">Dashboard</Button>
      );
    }

    return (
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant={"dense"}>
          <Button component={ Link } to="/" color="inherit">Home</Button>
          <Button component={ Link } to="/reviews" color="inherit">Reviews</Button>
          {dashboardMenuItem}
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {loginLogoutMenuItem}
        </Toolbar>
      </AppBar>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(BdcMenu));