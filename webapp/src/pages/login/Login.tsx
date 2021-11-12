import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import Loading from 'components/Loader';
import MeContext from 'contexts/MeContext';

const Login = () => {
  const { me, isLoading } = useContext(MeContext);

  if (isLoading) {
    return <Loading />;
  }

  if (me) {
    return <Navigate to="/" replace={true} />;
  }

  return <button>Login / Sign Up</button>;
};

export default Login;
