import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import ThemeProvider from './ThemeProvider';
import FourOhFour from 'pages/404';
import Home from 'pages/home';
import Login from 'pages/login';

const App = () => (
  <ThemeProvider>
    <CssBaseline />
    <Router>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
        clientId={process.env.REACT_APP_AUTH0_CLIENTID || ''}
        redirectUri={window.location.origin}
      >
        <Routes>
          <ProtectedRoute path="/" component={Home} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<FourOhFour />} />
        </Routes>
      </Auth0Provider>
    </Router>
  </ThemeProvider>
);

export default App;
