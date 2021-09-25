import { Switch, Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import Home from 'page/home';
import Login from 'page/login';

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <Route path="/login" component={Login} />
  </Switch>
);

export default App;
