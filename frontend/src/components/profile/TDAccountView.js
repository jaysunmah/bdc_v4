import React, { Component } from 'react';
import { connect } from "react-redux";

import ProfileContainer from "./ProfileContainer";
import { tdameritrade } from "../../../actions";
import {Link} from "react-router-dom";

class TDAccountView extends Component {
  state = {
    refresh_token: "",
    access_token: "",
    account_id: "",
    client_id: ""
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

  render() {
    let tda = this.props.tdameritrade;
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TDAccountView);