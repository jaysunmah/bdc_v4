import React, {Component} from 'react'
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import {connect} from "react-redux";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {dashboard} from "../../../actions";

class TransfersTable extends Component {
  getTransferUid({ date, action, amount }) {
    const { transfers, selected_portfolio_id, processing_transfer, selected_portfolio } = this.props.dashboard;
    let curr_action = action == "DEPOSIT";
    let curr_amount = amount;
    let curr_date = date;

    let portfolio_transfers = transfers
      .filter(({ portfolio, amount, is_deposit_type, date, manually_added }) =>
        manually_added &&
        (portfolio+"")===(selected_portfolio_id+"") &&
        date.substr(0, 10) === curr_date &&
        parseFloat(amount) === curr_amount &&
        is_deposit_type === curr_action
      );

    return portfolio_transfers[0]['uid'];
  }

  handleAddTransfer({ date, action, amount }) {
    date = date ? date : new Date();
    date = date.toISOString().substr(0, 10);
    const { brokerage } = this.props.dashboard.selected_portfolio;
    this.props.saveTransfer({ date, action, amount, brokerage });
  }

  handleDeleteTransfer(data) {
    this.props.deleteTransfer(this.getTransferUid(data));
  }

  handleEditTransfer({ date, amount, action }, data) {
    date = date ? date : new Date();
    let uid = this.getTransferUid(data);
    this.props.editTransfer(uid, { date, amount, action });
  }

  render() {
    const { transfers, selected_portfolio_id, processing_transfer, selected_portfolio } = this.props.dashboard;
    const { brokerage } = selected_portfolio;
    let portfolio_transfers = transfers
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ amount, is_deposit_type, date, manually_added }) => {
        let action = is_deposit_type ? "DEPOSIT" : "WITHDRAW";
        let type = manually_added ? "MANUAL" : "SCRAPED";
        amount = parseFloat(parseFloat(amount).toFixed(2));
        return { date, amount, type, action };
      });

    let transfer_columns = [
      { title: 'Date', field: 'date', editComponent: props => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              clearable
              value={props.value}
              placeholder="2017-06-24"
              onChange={(new_date) => { props.onChange(new_date) }}
              format="yyyy-MM-dd"
            />
          </MuiPickersUtilsProvider>
        )},
      { title: 'Action', field: 'action', lookup: { WITHDRAW: 'WITHDRAW', DEPOSIT: 'DEPOSIT' } },
      { title: 'Amount', field: 'amount', type: 'numeric' },
      { title: 'Type', field: 'type', initialEditValue: 'MANUAL', editable: 'never' }
    ];
    return (
      <MaterialTable
        isLoading={processing_transfer}
        title={"Transfers"}
        columns={transfer_columns}
        data={portfolio_transfers}
        editable={{
          isEditable: ({ type }) => type === "MANUAL",
          isDeletable: ({ type }) => type === "MANUAL",
          onRowAdd: (data) =>
            new Promise((resolve, reject) => {
              this.handleAddTransfer(data);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              this.handleEditTransfer(newData, oldData);
              resolve();
            }),
          onRowDelete: data =>
            new Promise((resolve, reject) => {
              this.handleDeleteTransfer(data);
              resolve();
            })
        }}
        actions={brokerage === "web" ? [] : [
          {
            icon: () => {
              if (true) {
                return (<Icon>refresh</Icon>);
              }
              return (<i className={"small spinner loading icon"} />);
            },
            tooltip: 'Refresh transfers data',
            onClick: (e, d) => {
              console.log(e, d);
            },
            isFreeAction: true
          }
        ]}
      />
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
    saveTransfer: (data) => dispatch(dashboard.saveTransfer(data)),
    deleteTransfer: (uid) => dispatch(dashboard.deleteTransfer(uid)),
    editTransfer: (uid, data) => dispatch(dashboard.editTransfer(uid, data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransfersTable);