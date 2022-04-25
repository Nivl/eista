import { Meta, Story } from '@storybook/react';

import SignUp from './SignUp';

const Template: Story = args => <SignUp {...args} />;

export const Default = Template.bind({});

export const DarkMode = Template.bind({});
DarkMode.args = {
  theme: 'dark',
};

export default {
  component: SignUp,
  title: 'pages/SignUp',
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
