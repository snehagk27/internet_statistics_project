import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/country">Country Summary</Link>
    </nav>
  );
};

export default Navbar;
