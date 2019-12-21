import React from 'react';
import { NavLink } from 'react-router-dom';

import * as Icon from 'react-feather';

export default function Nav() {
  return (
    <div className='nav'>
      <NavLink to='upload'>
        <Icon.FilePlus size={28}></Icon.FilePlus>
      </NavLink>

      <NavLink to='home'>
        <Icon.Home size={28}></Icon.Home>
      </NavLink>

      <NavLink to='profile'>
        <Icon.User size={28}></Icon.User>
      </NavLink>
    </div>
  );
}
