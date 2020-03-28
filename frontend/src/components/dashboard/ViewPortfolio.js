import React, { Component } from 'react'
import {dashboard} from "../../../actions";
import {connect} from "react-redux";
import CreatePortfolio from "./CreatePortfolio";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import {green} from "@material-ui/core/colors";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PositionsTable from "./PositionsTable";
import OrdersTable from "./OrdersTable";
import TransfersTable from "./TransfersTable";

class ViewPortfolio extends Component {

  handleDeletePortfolio() {
    if (confirm("WARNING: Deleting this portfolio will also delete any existing orders and positions tied to it. Are you sure?")) {
      const { selected_portfolio_id } = this.props.dashboard;
      this.props.deletePortfolio(selected_portfolio_id);
    }
  }

  render() {
    const { selected_portfolio, selected_portfolio_id, deleting_portfolio } = this.props.dashboard;
    if (selected_portfolio_id === -1) {
      return (
        <div>TODO figure out what to show here</div>
      );
    } else if (selected_portfolio_id === -2) {
      return (<CreatePortfolio />);
    }
    const { nickname, brokerage } = selected_portfolio;
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
            <IconButton aria-label="delete" style={{position: 'relative'}}>
              <DeleteIcon />
              {deleting_portfolio && <CircularProgress size={45} style={{
                color: green[500],
                position: 'absolute',
                zIndex: 1,
              }}/>  }
            </IconButton>
          </Tooltip>
        </h1>
        <p>{brokerage}</p>
        <PositionsTable />
        <br></br>
        <OrdersTable />
        <br></br>
        <TransfersTable />
      </div>
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
    deletePortfolio: (port_id) => {
      dispatch(dashboard.deletePortfolio(port_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPortfolio);

