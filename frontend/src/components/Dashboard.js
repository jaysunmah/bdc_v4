import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";

class Dashboard extends Component {

  componentDidMount() {
    this.props.loadAllPortfolios();
  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);