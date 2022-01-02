import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import AppProvider from 'providers/AppProvider';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  const enableMSW = require('../src/mocks').default; // eslint-disable-line @typescript-eslint/no-var-requires
  enableMSW();
}

const App = ({ Component, pageProps }: AppProps) => (
  <AppProvider>
    <CssBaseline />
    <Component {...pageProps} />
  </AppProvider>
);

export default App;
