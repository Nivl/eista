import { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider as ExternalQueryClientProvider,
} from 'react-query';

const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient();

  return (
    <ExternalQueryClientProvider client={client}>
      {children}
    </ExternalQueryClientProvider>
  );
};

export default QueryClientProvider;
