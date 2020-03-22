import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react'

import BdcContainer from "../BdcContainer";
import ProfileMenu from "./ProfileMenu";

class ProfileContainer extends Component {
  render() {
    return (
      <BdcContainer>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={5} tablet={16}>
              <ProfileMenu></ProfileMenu>
            </Grid.Column>
            <Grid.Column computer={11} tablet={16} stretched>
              <Segment>
                {this.props.children}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </BdcContainer>
    );
  }
}

export default ProfileContainer;