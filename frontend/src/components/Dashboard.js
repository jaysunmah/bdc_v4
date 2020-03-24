import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import { Grid, Segment } from 'semantic-ui-react'

class Dashboard extends Component {

  componentDidMount() {
    this.props.loadAllPortfolios();
    this.props.loadAllPositions();
  }

  renderPortfolio(portfolio_id) {
    const { positions, portfolios } = this.props.dashboard;
    const { nickname, brokerage } = portfolios[portfolio_id];
    let portfolio_positions = positions.filter(({ portfolio }) => (portfolio + "") === (portfolio_id + ""));
    return (
      <div key={portfolio_id}>
        <h2>{nickname}</h2>
        <p>Brokerage type: {brokerage}</p>
        <ul>
          {portfolio_positions.map(({ quantity, value, stock }, i) => <li key={i}>{quantity} of {stock} shares, value of {value}</li>)}
        </ul>
        <br></br>
      </div>
    );

  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
        {Object.keys(this.props.dashboard.portfolios).map(this.renderPortfolio.bind(this))}
        <Grid columns={3} >
          <Grid.Row stretched>
            <Grid.Column>
              <Segment>1</Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>1</Segment>
              <Segment>2</Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>1</Segment>
              <Segment>2</Segment>
              <Segment>3</Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);