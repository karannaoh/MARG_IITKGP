import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './styles/app.scss';
import Upload from './components/Upload';
import Home from './components/Home';
import Profile from './components/Profile';
import Nav from './components/Nav';

function App() {
  return (
    <div className='App'>
      <Router>
        <div className='app-screen'>
          <Switch>
            <Route path='/upload'>
              <Upload />
            </Route>
            <Route path='/profile'>
              <Profile />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
        <Nav></Nav>
      </Router>
    </div>
  );
}

export default App;
