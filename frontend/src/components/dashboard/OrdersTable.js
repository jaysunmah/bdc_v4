import React, { Component } from 'react'
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import {connect} from "react-redux";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class OrdersTable extends Component {
  render() {
    const { orders, selected_portfolio_id, selected_portfolio } = this.props.dashboard;
    const { brokerage } = selected_portfolio;
    let portfolio_orders = orders
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ stock, quantity, value, is_buy_type, date }) => {
        let type = is_buy_type ? "BUY" : "SELL";
        let amount = parseFloat((new Number(quantity) * new Number(value)).toFixed(2));
        return { date: date.substr(0, 10), stock, type, quantity: parseFloat(quantity), price: parseFloat(value), value: amount };
      });

    let ordersColumns = [
      { title: 'Date', field: 'date' , editComponent: props => (
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
      { title: 'Stock', field: 'stock' },
      { title: 'Type', field: 'type', lookup: { BUY: "BUY", SELL: "SELL" } },
      { title: 'Quantity', field: 'quantity', type: "numeric" },
      { title: 'Price', field: 'price', type: "numeric" },
      { title: 'Value', field: 'value', type: "numeric" }
    ];
    return (
      <MaterialTable
        title={"Orders"}
        columns={ordersColumns}
        editable={brokerage != "web" ? null : {
          isEditable: rowData => rowData.name === "a", // only name(a) rows would be editable
          isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
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
        data={portfolio_orders}
        actions={[
          {
            icon: () => {
              if (true) {
                return (<Icon>refresh</Icon>);
              }
              return (<i className={"small spinner loading icon"} />);
            },
            tooltip: 'Refresh orders data',
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

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);