import React, {Component} from 'react'
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import {connect} from "react-redux";

class TransfersTable extends Component {
  render() {
    const { transfers, selected_portfolio_id } = this.props.dashboard;
    let portfolio_transfers = transfers
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ amount, is_deposit_type, date, manually_added }) => {
        let action = is_deposit_type ? "DEPOSIT" : "WITHDRAW";
        let type = manually_added ? "MANUAL" : "SCRAPED";
        amount = parseFloat(parseFloat(amount).toFixed(2));
        return { date, amount, type, action };
      });

    let transfer_columns = [
      { title: 'Date', field: 'date' },
      { title: 'Action', field: 'action' },
      { title: 'Amount', field: 'amount' },
      { title: 'Type', field: 'type' }
    ];
    return (
      <MaterialTable
        title={"Transfers"}
        columns={transfer_columns}
        data={portfolio_transfers}
        editable={{
          isEditable: ({ type }) => type === "MANUAL",
          isDeletable: ({ type }) => type === "MANUAL",
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  /* const data = this.state.data;
                  data.push(newData);
                  this.setState({ data }, () => resolve()); */
                }
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  /* const data = this.state.data;
                  const index = data.indexOf(oldData);
                  data[index] = newData;
                  this.setState({ data }, () => resolve()); */
                }
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  /* let data = this.state.data;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve()); */
                }
                resolve();
              }, 1000);
            })
        }}
        actions={[
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransfersTable);