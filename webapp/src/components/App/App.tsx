import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import QueryClientProvider from './QueryClientProvider';
import ThemeProvider from './ThemeProvider';
import { MeProvider } from 'contexts/MeContext';
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
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<FourOhFour />} />
            </Routes>
          </Auth0Provider>
        </Router>
      </MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
