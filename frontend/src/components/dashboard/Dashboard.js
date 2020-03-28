import React, { Component } from 'react'
import BdcContainer from "../BdcContainer";
import { dashboard } from "../../../actions";
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
import { green } from '@material-ui/core/colors';
import ViewPortfolio from "./ViewPortfolio";

class Dashboard extends Component {
  componentDidMount() {
    this.props.loadAllPortfolios();
    this.props.loadAllPositions();
    this.props.loadAllOrders();
    this.props.loadAllTransfers();
  }

  handlePortfolioSelect = (port_id) => {
    this.props.selectPortfolio(port_id);
  }

  renderMenu() {
    const { portfolios, selected_portfolio_id } = this.props.dashboard;
    return (
      <Tabs value={parseInt(selected_portfolio_id)}>
        <Tab
          label={"All"}
          value={-1}
          onClick={() => this.handlePortfolioSelect(-1)}
        />
        {Object.keys(portfolios).map((port_id, i) =>{
            return <Tab
              key={i}
              value={parseInt(port_id)}
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
              <ViewPortfolio />
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
    loadAllTransfers: () => dispatch(dashboard.loadAllTransfers()),
    selectPortfolio: (port_id) => dispatch(dashboard.selectPortfolio(port_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);