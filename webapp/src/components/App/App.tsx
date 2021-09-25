import { Switch, Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import Home from 'page/home';
import Login from 'page/login';
import FourOhFour from 'page/404';

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default App;
