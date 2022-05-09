import { Meta, Story } from '@storybook/react';

import { Login } from './Login';

const Template: Story = args => <Login {...args} />;

export const Default = Template.bind({});

export const DarkMode = Template.bind({});
DarkMode.args = {
  theme: 'dark',
};

export default {
  component: Login,
  title: 'pages/Login',
  args: {
    theme: 'light',
  },
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
  },
} as Meta;
