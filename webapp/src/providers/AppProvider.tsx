import { QueryClientProvider } from 'providers/QueryClientProvider';
import { ThemeProvider } from 'providers/ThemeProvider';
import { ReactNode } from 'react';

import { MeProvider } from 'contexts/MeContext';

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider>
    <ThemeProvider>
      <MeProvider>{children}</MeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
