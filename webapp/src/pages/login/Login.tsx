import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

import Loading from 'components/Loader';

const Login = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (isLoading) {
    return <Loading />;
  }

  return <button onClick={() => loginWithRedirect()}>Login / Sign Up</button>;
};

export default Login;
