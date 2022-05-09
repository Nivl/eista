module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  staticDirs: ['../public'],
  features: {
    postcss: false,
    // https://github.com/mui/material-ui/issues/24282#issuecomment-967747802
    emotionAlias: false,
  },
};
