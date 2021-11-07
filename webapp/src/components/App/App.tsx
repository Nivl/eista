import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import MeProvider from './MeProvider';
import ProtectedRoute from './ProtectedRoute';
import QueryClientProvider from './QueryClientProvider';
import ThemeProvider from './ThemeProvider';
import FourOhFour from 'pages/404';
import Home from 'pages/home';
import Login from 'pages/login';

const App = () => (
  <QueryClientProvider>
    <ThemeProvider>
      <MeProvider>
        <CssBaseline />
        <Router>
          <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
            clientId={process.env.REACT_APP_AUTH0_CLIENTID || ''}
            redirectUri={window.location.origin}
          >
            <Switch>
              <ProtectedRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="*" component={FourOhFour} />
            </Switch>
          </Auth0Provider>
        </Router>
      </MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
