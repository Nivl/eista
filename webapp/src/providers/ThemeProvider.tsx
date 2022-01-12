import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FC, useMemo } from 'react';

import useLocalStorage from 'hooks/useLocalStorage';

const Theme: FC<{
  scheme?: 'dark' | 'light';
}> = ({ scheme, children }) => {
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

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
