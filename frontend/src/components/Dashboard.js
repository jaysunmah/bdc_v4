import React, { Component } from 'react'
import BdcContainer from "./BdcContainer";
import { dashboard } from "../../actions";
import { connect } from "react-redux";
import { Grid, Segment } from 'semantic-ui-react'

class Dashboard extends Component {

  componentDidMount() {
    this.props.loadAllPortfolios();
  }

  render() {
    return (
      <BdcContainer>
        <h1>Dashboard</h1>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);