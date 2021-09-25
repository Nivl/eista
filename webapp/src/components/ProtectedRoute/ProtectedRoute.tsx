import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from 'components/design-system/Loading';
import { Route } from 'react-router-dom';

type Props = {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
};

const ProtectedRoute = ({ component, ...args }: Props) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <Loading />, //eslint-disable-line react/display-name
    })}
    {...args}
  />
);

export default ProtectedRoute;
