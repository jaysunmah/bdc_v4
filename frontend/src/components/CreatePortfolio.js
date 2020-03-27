import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {TextField, FormControlLabel} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

class CreatePortfolio extends Component {
  state = {
    create_port_name: "",
    save_as: "web"
  }

  handleSavePortfolio = e => {
    e.preventDefault();
    const { save_as, create_port_name } = this.state;
    console.log(save_as, create_port_name);
  }

  render() {
    const { save_as } = this.state;
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
          <div>
            <Button type={"submit"} color={"primary"} variant={"contained"}>Save Portfolio</Button>
          </div>
        </form>
      </div>

    );
  }
}

export default CreatePortfolio;