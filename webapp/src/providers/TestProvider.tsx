import { ThemeProvider } from 'providers/ThemeProvider';
import { ReactNode } from 'react';

import { MeContext, MeContextInterface } from 'contexts/MeContext';

// wrapper returns a react FC that wraps the component with the all
// needed contexts
export const wrapper = ({
  meProvider,
}: {
  meProvider?: MeContextInterface;
} = {}) =>
  function testWrapper({ children }: { children: ReactNode }) {
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
