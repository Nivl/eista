import { Meta, Story } from '@storybook/react';
import { PropsWithChildren } from 'react';

import FourOhFour from './FourOhFour';

const Template: Story<
  PropsWithChildren<unknown> & { theme: 'light' | 'dark' }
> = args => <FourOhFour {...args} />;

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
