import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import MaterialTable, {MTableToolbar} from 'material-table';
import { AppBar, Tabs, Tab, Box, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

class Dashboard extends Component {

  componentDidMount() {
    this.props.loadAllPortfolios();
    this.props.loadAllPositions();
    this.props.loadAllOrders();
  }

  renderPortfolio() {
    const { orders, positions, selected_portfolio, selected_portfolio_id } = this.props.dashboard;
    if (selected_portfolio === undefined) {
      return (
        <div>TODO figure out what to show here</div>
      );
    }
    const { nickname, brokerage } = selected_portfolio;
    let portfolio_positions = positions
      .filter(({ portfolio }) => (portfolio + "") === (selected_portfolio_id + ""))
      .map(({ stock, quantity, value }) =>
        ({ stock, quantity: parseFloat(parseFloat(quantity).toFixed(2)), value: parseFloat(parseFloat(value).toFixed(2))}));

    let portfolio_orders = orders
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ stock, quantity, value, is_buy_type, date }) => {
        let type = is_buy_type ? "BUY" : "SELL";
        let amount = parseFloat((new Number(quantity) * new Number(value)).toFixed(2));
        return { date: date.substr(0, 10), stock, type, quantity: parseFloat(quantity), price: parseFloat(value), value: amount };
      });
    let positionsColumns = [
      { title: 'Stock', field: 'stock' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Value', field: 'value' }
    ];
    let ordersColumns = [
      { title: 'Date', field: 'date' },
      { title: 'Stock', field: 'stock' },
      { title: 'Type', field: 'type' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Price', field: 'price' },
      { title: 'Value', field: 'value' }
    ];
    return (
      <div>
        <h1>{nickname}</h1>
        <p>{brokerage}</p>
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
        <br></br>
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
      </div>
    );
  }

  handlePortfolioSelect = (port_id) => {
    this.props.selectPortfolio(port_id);
  }

  renderMenu() {
    const { selected_portfolio, portfolios, selected_portfolio_id } = this.props.dashboard;
    return (
      <Tabs value={selected_portfolio_id}>
        <Tab
          label={"All"}
          value={-1}
          onClick={() => this.handlePortfolioSelect(-1)}
        />
        {Object.keys(portfolios).map((port_id, i) =>{
            return <Tab
              key={i}
              value={port_id}
              label={portfolios[port_id]['nickname']}
              onClick={() => this.handlePortfolioSelect(port_id)}
            />
          }
        )}
      </Tabs>
    );
  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
          <AppBar position={"static"} color={"inherit"}>
            {this.renderMenu()}
            <Typography
              component="div"
              role="tabpanel"
            >
              <Box p={3}>
                {this.renderPortfolio()}
              </Box>
            </Typography>
          </AppBar>
      </BdcContainer>
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
    loadAllPortfolios: () => dispatch(dashboard.loadAllPortfolios()),
    loadAllPositions: () => dispatch(dashboard.loadAllPositions()),
    loadAllOrders: () => dispatch(dashboard.loadAllOrders()),
    selectPortfolio: (port_id) => dispatch(dashboard.selectPortfolio(port_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);