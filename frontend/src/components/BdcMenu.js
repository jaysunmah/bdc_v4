import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Login from './Login';
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { auth } from '../../actions';
import bdcApp from "../../reducers";

let store = createStore(bdcApp, applyMiddleware(thunk));

class BdcMenu extends Component {
  state = {};
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state

    let loginLogoutMenuItem = (<Login></Login>);
    if (this.props.auth.isAuthenticated) {
      loginLogoutMenuItem = (
        <Menu.Item position='right'>
          Logout
        </Menu.Item>
      );
    }

    return (
      <Provider store={store}>
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

          {loginLogoutMenuItem}
        </Menu>
      </Provider>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
    },
    login: (username, password) => {
      return dispatch(auth.login(username, password));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BdcMenu);