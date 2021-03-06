import CssBaseline from '@mui/material/CssBaseline';

import { QueryClientProvider } from '../src/providers/QueryClientProvider';
import { ThemeProvider } from '../src/providers/ThemeProvider';

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
  Story => <QueryClientProvider>{Story()}</QueryClientProvider>,
  (Story, ctx) => (
    <ThemeProvider scheme={ctx.args.theme || 'light'}>{Story()}</ThemeProvider>
  ),
];
