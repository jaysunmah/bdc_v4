import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {TextField, FormControlLabel} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import {dashboard} from "../../actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from '@material-ui/core/colors';

class CreatePortfolio extends Component {
  state = {
    create_port_name: "",
    save_as: "web"
  }

  handleSavePortfolio = e => {
    e.preventDefault();
    const { save_as, create_port_name } = this.state;
    this.props.savePortfolio(create_port_name, save_as);
  }

  render() {
    const { save_as } = this.state;
    const { saving_portfolio } = this.props.dashboard;
    return (
      <div>
        <h2>Add New Portfolio</h2>
        <form noValidate autoComplete="off" onSubmit={this.handleSavePortfolio}>
          <TextField
            id="standard-basic"
            label="Portfolio Name"
            margin={"normal"}
            onChange={e => this.setState({create_port_name: e.target.value })}
          />
          <div>
            <FormControlLabel
              control={
                <Checkbox color={"primary"}
                          checked={save_as === "rh"}
                          onChange={() => {this.setState({save_as: save_as === "rh" ? "web" : "rh"})}}
                />
              }
              label={"Save as RH Portfolio"}
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox color={"primary"}
                          checked={save_as === "tda"}
                          onChange={() => {this.setState({save_as: save_as === "tda" ? "web" : "tda"})}}
                />
              }
              label={"Save as TD Portfolio"}
            />
          </div>
          <div style={{position: 'relative', display: 'inline-block'}}>
            <Button
              type={"submit"}
              color={"primary"}
              variant={"contained"}
              disabled={saving_portfolio}
            >Save Portfolio</Button>

            {saving_portfolio && <CircularProgress size={24} style={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -12,
              marginLeft: -12,
            }}/> }
          </div>
        </form>
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    dashboard: state.dashboard,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    savePortfolio: (name, type) => dispatch(dashboard.savePortfolio(name, type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePortfolio);