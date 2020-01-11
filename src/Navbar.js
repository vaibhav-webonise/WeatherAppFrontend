import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/weather'>Weather information</Link></li>
      </ul>
    </nav>
  )
}
