import { Link, NavLink } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import { useContext } from 'react';
import { IdentityContext } from '../contexts/IdentityContext';

const NavBar = () => {
  const { currentIdentity } = useContext(IdentityContext);

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={reactLogo} alt="Bootcamp Logo" width="24" height="24" className="d-inline-block align-text-top" />{' '}
          Bootcamp
        </Link>
        {currentIdentity ? (
          <NavLink className="nav-link" to="/logout">
            Log Out
          </NavLink>
        ) : (
          <NavLink to="/login" className="nav-link">
            Log In
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
