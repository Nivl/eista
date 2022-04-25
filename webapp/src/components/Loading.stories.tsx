import { Meta, Story } from '@storybook/react';

import { Loading, Props } from './Loading';

const Template: Story<Props & { theme: 'light' | 'dark' }> = args => (
  <Loading {...args} />
);

export const Default = Template.bind({});

export const FullPage = Template.bind({});
FullPage.args = {
  fullPage: true,
};

export const DarkMode = Template.bind({});
DarkMode.args = {
  theme: 'dark',
};

export const Small = Template.bind({});
Small.args = {
  isSmall: true,
};

export default {
  component: Loading,
  title: 'components/Loading',
  args: {
    theme: 'light',
    hideText: false,
    isSmall: false,
    text: 'Loading...',
    fullPage: false,
  },
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
  },
} as Meta;
