import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';

import './base.scss';
// Admin User widgets
import Map from './components/Map';
import ListView from './components/ListView';

import * as Icon from 'react-feather';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Roads from './components/Roads';

function updateLink() {
  setTimeout(() => {
    let url = window.location.href;
    let nav = document.getElementsByClassName('links')[0];
    // passes on every "a" tag
    if (nav && nav.children) {
      console.log(nav.children, url);
      Array.from(nav.children).forEach(function(child) {
        // checks if its the same on the address bar
        // console.log(url, child.children[0].href);
        if (url === child.children[0].href) {
          child.classList.add('active');
          //for making parent of submenu active
        } else {
          child.classList.remove('active');
        }
      });
    }
  }, 100);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        type: 'admin',
        name: 'Parth',
        image: 'https://i.imgur.com/27KPlXB.png'
      },
      data: null
    };
  }
  componentDidMount() {
    updateLink();
  }

  loginUser = (username, password) => {
    // Get the current 'global' time from an API using Promise
    // console.log('Logging In user: ', user);
    if (username === 'admin' && password === 'admin') {
      this.setState({
        user: {
          type: 'admin',
          name: 'Parth',
          image: 'https://i.imgur.com/27KPlXB.png'
        }
      });
    } else {
      return false;
    }
  };

  logoutUser = () => {
    this.setState({
      user: null
    });
  };

  render() {
    let { user, data } = this.state;

    // console.log(user, data);

    if (user === null) {
      return (
        <div className='App'>
          <Login user={user} loginUser={this.loginUser} />
        </div>
      );
    } else {
      return (
        <div className='App'>
          <Navbar user={user} logoutUser={this.logoutUser}></Navbar>

          <div className='dashboard'>
            <div className='sidebar'>
              <img src={user.image} alt='' />
              <h1>{user.name}</h1>
              <ul className='links'>
                <li>
                  <Link onClick={updateLink} to='/'>
                    <Icon.Grid></Icon.Grid> Grid
                  </Link>
                </li>
                <li>
                  <Link onClick={updateLink} to='/map'>
                    <Icon.Map></Icon.Map> Map
                  </Link>
                </li>
                <li>
                  <Link onClick={updateLink} to='/roads'>
                    <Icon.AlertOctagon></Icon.AlertOctagon> Roads
                  </Link>
                </li>
              </ul>
            </div>
            <div className='item'>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={props => <ListView {...props} user={user} />}
                />
                <Route
                  exact
                  path='/map'
                  render={props => <Map {...props} user={user} />}
                />
                <Route
                  exact
                  path='/roads'
                  render={props => <Roads {...props} user={user}></Roads>}
                />
              </Switch>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
