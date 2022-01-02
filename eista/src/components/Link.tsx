import { Link as MuiLink } from '@mui/material';
import RouterLink from 'next/link';
import { FC } from 'react';

const Link: FC<{
  href: string;
  underline?: 'always' | 'hover' | 'none';
}> = ({ href, children, underline = 'hover' }) => (
  <RouterLink href={href} passHref>
    <MuiLink underline={underline}>{children}</MuiLink>
  </RouterLink>
);

export default Link;
