import { Link as MuiLink } from '@mui/material';
import RouterLink from 'next/link';
import { ReactNode } from 'react';

export const Link = ({
  href,
  children,
  underline = 'hover',
}: {
  href: string;
  underline?: 'always' | 'hover' | 'none';
  children: ReactNode;
}) => (
  <RouterLink href={href} passHref>
    <MuiLink underline={underline}>{children}</MuiLink>
  </RouterLink>
);
