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

  renderloginButton() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      return (<Button component={ Link } to="/profile" color="inherit" onClick={() => this.props.selectItem("/profile")}>Profile</Button>);
    }
    return (<Button component={ Link } to="/login" color="inherit">Login</Button>);
  }

  renderDashboardItem() {
    const { isAuthenticated } = this.props.auth;
    return isAuthenticated && (<Button component={ Link } to="/dashboard" color="inherit">Dashboard</Button>);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant={"dense"}>
          <Button component={ Link } to="/" color="inherit">Home</Button>
          <Button component={ Link } to="/reviews" color="inherit">Reviews</Button>
          {this.renderDashboardItem()}
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {this.renderloginButton()}
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