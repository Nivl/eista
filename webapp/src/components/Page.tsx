import { Box, Container } from '@mui/material';
import { FC } from 'react';

const Page: FC<{
  fullWidth?: boolean;
}> = ({ children, fullWidth = false }) => (
  <Box>
    <Container maxWidth={fullWidth ? 'lg' : 'sm'}>{children}</Container>
  </Box>
);

export default Page;
