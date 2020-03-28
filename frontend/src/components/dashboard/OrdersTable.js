import React, { Component } from 'react'
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import {connect} from "react-redux";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Input from "@material-ui/core/Input";
import {dashboard} from "../../../actions";

class OrdersTable extends Component {
  getOrderUid({ date, stock, action, quantity, price }) {
    const { orders, selected_portfolio_id } = this.props.dashboard;
    let curr_stock = stock;
    let curr_date = date;
    let curr_action = action === "BUY";
    let curr_quantity = quantity;
    let curr_price = price;

    let port_manual_orders = orders
      .filter(({ portfolio, uid, stock, quantity, value, is_buy_type, date, manually_added }) =>
        manually_added &&
        (portfolio+"")===(selected_portfolio_id+"") &&
        curr_stock === stock &&
        is_buy_type === curr_action &&
        parseFloat(quantity) === curr_quantity &&
        parseFloat(value) === curr_price &&
        date.substr(0, 10) === curr_date
      );
    return port_manual_orders[0]['uid'];
  }

  handleAddOrder({ action, stock, quantity, price, date }) {
    const { selected_portfolio } = this.props.dashboard;
    const { brokerage } = selected_portfolio;
    date = date ? date : new Date();
    date = date.toISOString().substr(0, 10);
    this.props.saveOrder(brokerage, { action, stock, quantity, price, date });
  }

  handleDeleteOrder(data) {
    let uid = this.getOrderUid(data);
    this.props.deleteOrder(uid);
  }

  handleEditOrder({ date, stock, action, quantity, price }, data) {
    let uid = this.getOrderUid(data);
    date = date ? date : new Date();
    this.props.editOrder(uid, { date, stock, action, quantity, price });
  }

  render() {
    const { orders, selected_portfolio_id, selected_portfolio, processing_order } = this.props.dashboard;
    const { brokerage } = selected_portfolio;
    let portfolio_orders = orders
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ manually_added, stock, quantity, value, is_buy_type, date }) => {
        let action = is_buy_type ? "BUY" : "SELL";
        let type = manually_added ? "MANUAL" : "SCRAPED";
        let amount = parseFloat((new Number(quantity) * new Number(value)).toFixed(2));
        return { date: date.substr(0, 10), stock, action, quantity: parseFloat(quantity), price: parseFloat(value), value: amount, type };
      });

    let ordersColumns = [
      { title: 'Date', field: 'date' , editComponent: props => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              clearable
              value={props.value}
              placeholder={new Date().toISOString().substr(0, 10)}
              onChange={(new_date) => { props.onChange(new_date) }}
              format="yyyy-MM-dd"
            />
          </MuiPickersUtilsProvider>
        )},
      { title: 'Stock', field: 'stock', editComponent: props => (
          <Input value={props.value || ''} onChange={(e) => {
            let input_value = e.target.value.toUpperCase().replace(/[0-9]/g, "");
            props.onChange(input_value.substr(0, 5));
          }} />
        ) },
      { title: 'Action', field: 'action', lookup: { BUY: "BUY", SELL: "SELL" } },
      { title: 'Quantity', field: 'quantity', type: "numeric" },
      { title: 'Price', field: 'price', type: "numeric" },
      { title: 'Value', field: 'value', type: "numeric", editable: 'never' },
      { title: 'Type', field: 'type', editable: 'never' }
    ];
    return (
      <MaterialTable
        isLoading={processing_order}
        title={"Orders"}
        columns={ordersColumns}
        editable={{
          isEditable: ({ type }) => type === "MANUAL",
          isDeletable: ({ type }) => type === "MANUAL",
          onRowAdd: (data) =>
            new Promise((resolve, reject) => {
              this.handleAddOrder(data);
              resolve();
            }),
          onRowUpdate: (new_data, old_data) =>
            new Promise((resolve, reject) => {
              this.handleEditOrder(new_data, old_data)
              resolve()
            }),
          onRowDelete: old_data =>
            new Promise((resolve, reject) => {
              this.handleDeleteOrder(old_data);
              resolve();
            })
        }}
        data={portfolio_orders}
        actions={brokerage === "web" ? [] : [
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
    saveOrder: (brokerage, data) => dispatch(dashboard.saveOrder(brokerage, data)),
    deleteOrder: (uid) => dispatch(dashboard.deleteOrder(uid)),
    editOrder: (uid, data) => dispatch(dashboard.editOrder(uid, data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable);