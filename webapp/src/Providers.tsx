import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'components/App';

const Providers = () => (
  <Router>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID || ''}
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </Router>
);

export default Providers;
