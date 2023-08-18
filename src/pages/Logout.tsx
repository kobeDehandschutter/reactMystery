import { useContext, useEffect } from 'react';
import { IdentityContext } from '../contexts/IdentityContext';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  const { setCurrentIdentity } = useContext(IdentityContext);

  useEffect(() => setCurrentIdentity(null), [setCurrentIdentity]);

  return <Navigate to="/" />;
};

export default Logout;
