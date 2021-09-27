import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';

const Theme = ({
  scheme,
  children,
}: {
  scheme?: 'dark' | 'light';
  children: JSX.Element;
}) => {
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  if (scheme) {
    prefersDarkMode = scheme == 'dark';
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
