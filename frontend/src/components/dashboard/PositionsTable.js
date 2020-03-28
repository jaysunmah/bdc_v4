import React, { Component } from 'react'
import MaterialTable from "material-table";
import {dashboard} from "../../../actions";
import {connect} from "react-redux";

class PositionsTable extends Component {
  render() {
    const { positions, selected_portfolio_id } = this.props.dashboard;
    let positionsColumns = [
      { title: 'Stock', field: 'stock' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Value', field: 'value' }
    ];

    let portfolio_positions = positions
      .filter(({ portfolio }) => (portfolio + "") === (selected_portfolio_id + ""))
      .map(({ stock, quantity, value }) =>
        ({ stock, quantity: parseFloat(parseFloat(quantity).toFixed(2)), value: parseFloat(parseFloat(value).toFixed(2))}));

    return (
      <MaterialTable
        title={"Positions"}
        columns={positionsColumns}
        data={portfolio_positions}
        actions={[
          {
            icon: 'refresh',
            tooltip: 'Refresh positions data',
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

export default connect(mapStateToProps, mapDispatchToProps)(PositionsTable);
