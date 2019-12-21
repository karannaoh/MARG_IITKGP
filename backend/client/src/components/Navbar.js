import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, logoutUser }) {
  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <a
          role='button'
          className='navbar-burger burger'
          aria-label='menu'
          aria-expanded='false'
          data-target='navbarBasicExample'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div id='navbarBasicExample' className='navbar-menu'>
        <div className='navbar-end'>
          <div className='navbar-item'>
            {user ? (
              <div className='buttons'>
                <div onClick={logoutUser} className='button is-light'>
                  Logout
                </div>
              </div>
            ) : (
              <div className='buttons'>
                <Link to='/' className='button is-primary'>
                  <strong>Login</strong>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
