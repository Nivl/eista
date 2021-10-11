import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FC, useMemo } from 'react';

const Theme: FC<{
  scheme?: 'dark' | 'light';
}> = ({ scheme, children }) => {
  let prefersLightkMode = useMediaQuery('(prefers-color-scheme: light)');
  if (scheme) {
    prefersLightkMode = scheme == 'light';
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersLightkMode ? 'light' : 'dark',
        },
      }),
    [prefersLightkMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
