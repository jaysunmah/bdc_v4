import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class BdcMenu extends Component {
  state = {};
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item
          name='editorials'
          active={activeItem === 'editorials'}
          onClick={this.handleItemClick}
        >
          Editorials!
        </Menu.Item>

        <Menu.Item
          name='reviews'
          active={activeItem === 'reviews'}
          onClick={this.handleItemClick}
        >
          Reviews
        </Menu.Item>

        <Menu.Item
          name='upcomingEvents'
          active={activeItem === 'upcomingEvents'}
          onClick={this.handleItemClick}
        >
          Upcoming Events
        </Menu.Item>
        <Menu.Item
          position='right'
          name='login'
          active={activeItem === 'login'}
          onClick={this.handleItemClick}
        >
          Login
        </Menu.Item>
      </Menu>
    )
  }
}