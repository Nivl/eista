import { Route, Switch } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';
import FourOhFour from 'pages/404';
import Home from 'pages/home';
import Login from 'pages/login';

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default App;
