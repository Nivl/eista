import { Meta, Story } from '@storybook/react';

import { FourOhFour } from './FourOhFour';

const Template: Story = args => <FourOhFour {...args} />;

export const Default = Template.bind({});

export const DarkMode = Template.bind({});
DarkMode.args = {
  theme: 'dark',
};

export default {
  component: FourOhFour,
  title: 'pages/FourOhFour',
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
