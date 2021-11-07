import { Route } from 'react-router-dom';

import useMe from 'hooks/useMe';

//import Loader from 'components/Loader';

type Props = {
  component: React.ComponentType<unknown>;
  [x: string]: unknown;
};

const ProtectedRoute = ({ component, ...args }: Props) => {
  console.log(useMe());
  return <Route component={component} {...args} />;
};

export default ProtectedRoute;
