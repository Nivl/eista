import QueryClientProvider from 'providers/QueryClientProvider';
import ThemeProvider from 'providers/ThemeProvider';
import { FC } from 'react';

import { MeProvider } from 'contexts/MeContext';

const AppProvider: FC = ({ children }) => (
  <QueryClientProvider>
    <ThemeProvider>
      <MeProvider>{children}</MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default AppProvider;
