import React, { Component } from 'react'
import MaterialTable from "material-table";
import Icon from "@material-ui/core/Icon";
import {connect} from "react-redux";

class OrdersTable extends Component {
  render() {
        const { orders, selected_portfolio_id } = this.props.dashboard;
    let portfolio_orders = orders
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ stock, quantity, value, is_buy_type, date }) => {
        let type = is_buy_type ? "BUY" : "SELL";
        let amount = parseFloat((new Number(quantity) * new Number(value)).toFixed(2));
        return { date: date.substr(0, 10), stock, type, quantity: parseFloat(quantity), price: parseFloat(value), value: amount };
      });

    let ordersColumns = [
      { title: 'Date', field: 'date' },
      { title: 'Stock', field: 'stock' },
      { title: 'Type', field: 'type' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Price', field: 'price' },
      { title: 'Value', field: 'value' }
    ];
    return (
      <MaterialTable
        title={"Orders"}
        columns={ordersColumns}
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