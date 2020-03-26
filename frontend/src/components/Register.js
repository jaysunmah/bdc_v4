import React, {Component} from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link, Redirect} from "react-router-dom";
import {auth} from '../../actions';
import {connect} from "react-redux";
import { withStyles } from "@material-ui/core/styles";


import BdcContainer from "./BdcContainer";

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    flexDirection: 'column',
    alignItems: 'center',
  }
});

class Register extends Component {
  state = {
    username: "",
    password: "",
    confirmPassword:""
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.register(this.state.username, this.state.password, this.state.confirmPassword);
    setTimeout(() => { 
        if (this.props.errors.length === 0) {
         this.props.login(this.state.username, this.state.password); 
        }       
    }, 250);
    
  };

  render() {
    const { classes } = this.props;
    if (this.props.isAuthenticated) {
      return <Redirect to="/"/>
    }

    let errors = null;
    if (this.props.errors.length > 0) {
      errors = this.props.errors.map((e, i) => {
        return <font color="red" key={i}>{e.message}</font>
      });
    }


    return (
    <BdcContainer>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
          <div className={classes.paper}>
          <div align="center">
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={e => this.setState({username: e.target.value})} />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => this.setState({password: e.target.value})} />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmpassword"
              label="ConfirmPassword"
              type="password"
              id="confirmpassword"
              onChange={e => this.setState({confirmPassword: e.target.value})} />
              {errors}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary">
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </BdcContainer>
  );}
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
    register: (username, password, confirmpassword) => {
      return dispatch(auth.register(username, password, confirmpassword));
    },
    login: (username, password) => {
      return dispatch(auth.login(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Register));
