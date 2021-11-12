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
        </Router>
      </MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
