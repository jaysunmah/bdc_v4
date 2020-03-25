import React, { Component } from 'react';
import { connect } from "react-redux";

import ProfileContainer from "./ProfileContainer";
import { tdameritrade } from "../../../actions";
import {Link} from "react-router-dom";
import { Loader, Icon } from 'semantic-ui-react'

class TDAccountView extends Component {
  state = {
    refresh_token: "",
    access_token: "",
    account_id: "",
    client_id: "",
  }

  componentDidMount() {
    this.props.loadTDAccount();
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.upsertTDAccount(this.props.tdameritrade.account);
  }

  handleEdit = edit => {
    let tda = {...this.props.tdameritrade.account, ...edit};
    this.props.editTDAccount(tda);
  }

  healthcheck = e => {
    this.props.healthcheckTD();
  }

  render() {
    let tda = this.props.tdameritrade;
    let health = null;
    if (tda.healthcheck === "loading") {
      health = <div className="ui active inline loader small"></div>
    } else if (tda.healthcheck === "pass") {
      health = <Icon name="check circle" color = "green"/>
    } else if (tda.healthcheck === "fail") {
      health = <Icon name="times circle" color = "red"/>
    }


    return (
      <ProfileContainer>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <legend>TD Account</legend>
            <p>
              <label htmlFor="username">Refresh token</label>
              <input
                type="text" id="refresh_token"
                onChange={e => this.handleEdit({refresh_token: e.target.value })}
                value={tda.account.refresh_token}
              />
            </p>
            <p>
              <label htmlFor="access_token">Access token</label>
              <input
                type="text" id="access_token"
                onChange={e => this.handleEdit({access_token: e.target.value})}
                value={tda.account.access_token}
              />
            </p>
            <p>
              <label htmlFor="password">Account id</label>
              <input
                type="text" id="account_id"
                onChange={e => this.handleEdit({account_id: e.target.value})}
                value={tda.account.account_id}
              />
            </p>
            <p>
              <label htmlFor="password">Client id</label>
              <input
                type="text" id="client_id"
                onChange={e => this.handleEdit({client_id: e.target.value})}
                value={tda.account.client_id}
              />
            </p>
            <p>
              <button type="submit">Save / Update</button>
            </p>
            <p>Status: {tda.status}</p>
          </fieldset>
        </form>
        <button onClick={this.healthcheck}>Healthcheck</button>
        {health}
      </ProfileContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    tdameritrade: state.tdameritrade,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTDAccount: () => dispatch(tdameritrade.loadTDAccount()),
    upsertTDAccount: (account) => dispatch(tdameritrade.upsertTDAccount(account)),
    editTDAccount: (account) => dispatch(tdameritrade.editTDAccount(account)),
    healthcheckTD: () => dispatch(tdameritrade.healthcheckTD())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TDAccountView);