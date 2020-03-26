import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import {Grid, Input, Menu, Segment} from 'semantic-ui-react'
import MaterialTable from 'material-table';

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
    let portfolio_positions = positions.filter(({ portfolio }) => (portfolio + "") === (selected_portfolio_id + ""));
    let portfolio_orders = orders
      .filter(({ portfolio }) => (portfolio+"")===(selected_portfolio_id+""))
      .map(({ stock, quantity, value, is_buy_type, date }) => {
        let type = is_buy_type ? "BUY" : "SELL";
        let amount = (new Number(quantity) * new Number(value)).toFixed(2);
        return { date: date.substr(0, 10), stock, type, quantity, price: value, value: amount };
      });
    console.log(portfolio_orders);
    let positionsColumns = [
      { title: 'Stock', field: 'stock' },
      { title: 'Quantity', field: 'quantity' },
      { title: 'Value', field: 'value' },
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
        />
        <br></br>
        <MaterialTable
          title={"Orders"}
          columns={ordersColumns}
          data={portfolio_orders}
          options={{
            date: {
              defaultSort: "desc"
            }
          }}
        />
      </div>
    );
  }

  handlePortfolioSelect = (port_id) => {
    this.props.selectPortfolio(port_id);
  }

  renderMenu() {
    const { selected_portfolio, portfolios } = this.props.dashboard;
    return (
      <Menu attached='top' tabular>
        <Menu.Item
          name='All'
          active={selected_portfolio === undefined}
          onClick={() => this.handlePortfolioSelect(-1)}
        />
        {Object.keys(portfolios).map((port_id, i) =>{
            return <Menu.Item
              key={i}
              name={portfolios[port_id]['nickname']}
              active={selected_portfolio != null ? selected_portfolio['nickname'] === portfolios[port_id]['nickname'] : false}
              onClick={() => this.handlePortfolioSelect(port_id)}
            />
          }
        )}
      </Menu>
    );

  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
        <div>
          {this.renderMenu()}
          <Segment attached='bottom'>
            {this.renderPortfolio()}
          </Segment>
        </div>
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