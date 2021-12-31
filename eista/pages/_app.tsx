import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';

import QueryClientProvider from 'components/App/QueryClientProvider';
import ThemeProvider from 'components/App/ThemeProvider';
import { MeProvider } from 'contexts/MeContext';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  const enableMSW = require('../src/mocks').default; // eslint-disable-line @typescript-eslint/no-var-requires
  enableMSW();
}

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider>
    <ThemeProvider>
      <MeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
