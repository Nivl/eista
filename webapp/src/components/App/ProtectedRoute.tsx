import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Route } from 'react-router-dom';

import Loader from 'components/Loader';

type Props = {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
};

const ProtectedRoute = ({ component, ...args }: Props) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <Loader fullPage={true} />, //eslint-disable-line react/display-name
    })}
    {...args}
  />
);

export default ProtectedRoute;
