import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Root = () => {
  return (
    <>
      <NavBar data-testid="navbar" />
      <div className="container-fluid">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
