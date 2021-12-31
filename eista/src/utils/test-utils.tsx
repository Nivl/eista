import { FC } from 'react';

import ThemeProvider from 'components/App/ThemeProvider';
import MeContext, { MeContextInterface } from 'contexts/MeContext';

// wrapper returns a react FC that wraps the component with the all
// needed contexts
export const wrapper = ({
  meProvider,
}: {
  meProvider?: MeContextInterface;
} = {}): FC =>
  function testWrapper({ children }) {
    return (
      <ThemeProvider>
        <MeContext.Provider
          value={
            meProvider ?? {
              me: {
                id: '1e5b95e3-ab0f-4b34-a25d-b272bd7575a7',
                name: 'John Doe',
                email: 'john.doe@domai.tld',
              },
              isLoading: false,
              isError: false,
              setMe: () => null,
            }
          }
        >
          {children}
        </MeContext.Provider>
      </ThemeProvider>
    );
  };
