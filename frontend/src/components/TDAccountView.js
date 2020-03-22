import React, { Component } from 'react';
import { connect } from "react-redux";

import BdcContainer from "./BdcContainer";
import { tdameritrade } from "../../actions";
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
    let tda = this.props.tdameritrade.account;
    this.props.upsertTDAccount(
      tda.refresh_token,
      tda.access_token,
      tda.account_id,
      tda.client_id
    );
  }

  handleEdit = edit => {
    let tda = {...this.props.tdameritrade.account, ...edit};
    this.props.editTDAccount(
      tda.refresh_token,
      tda.access_token,
      tda.account_id,
      tda.client_id
    );
  }

  render() {
    let tda = this.props.tdameritrade;
    return (
      <BdcContainer>
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
                value={tda.loaded ? tda.account.client_id : ""}
              />
            </p>
            <p>
              <button type="submit">Save / Update</button>
            </p>
            <p>Status: {tda.status}</p>
          </fieldset>
        </form>
      </BdcContainer>
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
    upsertTDAccount: (refresh_token, access_token, account_id, client_id) => dispatch(tdameritrade.upsertTDAccount(refresh_token, access_token, account_id, client_id)),
    editTDAccount: (refresh_token, access_token, account_id, client_id) => dispatch(tdameritrade.editTDAccount(refresh_token, access_token, account_id, client_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TDAccountView);