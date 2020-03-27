import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import MaterialTable, {MTableToolbar} from 'material-table';
import {AppBar, Tabs, Tab, Box, Typography, TextField} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

import CreatePortfolio from "./CreatePortfolio";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from '@material-ui/core/CircularProgress';

class Dashboard extends Component {


  componentDidMount() {
    this.props.loadAllPortfolios();
    this.props.loadAllPositions();
    this.props.loadAllOrders();
  }

  handleDeletePortfolio() {
    if (confirm("WARNING: Deleting this portfolio will also delete any existing orders and positions tied to it. Are you sure?")) {
      const { selected_portfolio_id } = this.props.dashboard;
      this.props.deletePortfolio(selected_portfolio_id);
    }
  }

  renderPortfolio() {
    const { orders, positions, selected_portfolio, selected_portfolio_id, deleting_portfolio } = this.props.dashboard;
    if (selected_portfolio_id === -1) {
      return (
        <div>TODO figure out what to show here</div>
      );
    } else if (selected_portfolio_id === -2) {
      return (<CreatePortfolio />);
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
        <h1>
          {nickname}
          <Tooltip title="Edit">
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Delete"
            onClick={this.handleDeletePortfolio.bind(this)}
          >
            <IconButton aria-label="delete">
              {deleting_portfolio ? <CircularProgress size={18}/> : <DeleteIcon /> }
            </IconButton>
          </Tooltip>
        </h1>

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
        <Tab
          label={"Add New Portfolio"}
          value={-2}
          onClick={() => this.handlePortfolioSelect(-2)}
        />
      </Tabs>
    );
  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
        <AppBar position={"static"}>
          {this.renderMenu()}
          <Typography
            component="div"
            role="tabpanel"
          >
            <Box p={3} style={{backgroundColor: "white", color: "black"}}>
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
    selectPortfolio: (port_id) => dispatch(dashboard.selectPortfolio(port_id)),
    deletePortfolio: (port_id) => dispatch(dashboard.deletePortfolio(port_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);