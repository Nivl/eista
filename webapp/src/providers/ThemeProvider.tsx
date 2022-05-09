import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ReactNode, useMemo } from 'react';

import { useLocalStorage } from 'hooks/useLocalStorage';

export const ThemeProvider = ({
  scheme,
  children,
}: {
  scheme?: 'dark' | 'light';
  children: ReactNode;
}) => {
  let prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');

  if (scheme) {
    prefersLightMode = scheme === 'light';
  }

  const [forcedScheme] = useLocalStorage<string>('theme', undefined, {
    subscribe: true,
  });
  if (forcedScheme === 'dark' || forcedScheme === 'light') {
    prefersLightMode = forcedScheme === 'light';
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersLightMode ? 'light' : 'dark',
          ...(prefersLightMode
            ? {}
            : {
                primary: {
                  main: '#9869c3',
                  dark: '#7134a9',
                },
              }),
        },
      }),
    [prefersLightMode],
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
