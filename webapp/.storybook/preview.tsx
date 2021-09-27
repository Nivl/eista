import { Tune } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';

import ThemeProvider from '../src/components/App/ThemeProvider';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  Story => <CssBaseline>{Story()}</CssBaseline>,
  (Story, ctx) => (
    <ThemeProvider scheme={ctx.args.theme || 'light'}>{Story()}</ThemeProvider>
  ),
];
