import { FC, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import Loader from 'components/Loader';
import MeContext from 'contexts/MeContext';

const ProtectedRoute: FC = ({ children }) => {
  const { me, isLoading } = useContext(MeContext);

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  if (!me) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
