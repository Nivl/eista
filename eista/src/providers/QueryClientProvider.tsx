import { FC } from 'react';
import {
  QueryClient,
  QueryClientProvider as ExternalQueryClientProvider,
} from 'react-query';

const QueryClientProvider: FC = ({ children }) => {
  const client = new QueryClient();

  return (
    <ExternalQueryClientProvider client={client}>
      {children}
    </ExternalQueryClientProvider>
  );
};

export default QueryClientProvider;
