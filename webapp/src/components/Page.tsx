import { Box, Container, useTheme } from '@mui/material';
import { ReactNode } from 'react';

const ScreenEdge = ({ position = 'top' }: { position?: 'top' | 'bottom' }) => {
  const theme = useTheme();
  const p: { top?: number | string; bottom?: number | string } = {};
  switch (position) {
    case 'bottom':
      p.bottom = 0;
      break;
    default:
      p.top = 0;
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(static/images/hero_${theme.palette.mode}.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '10px',
        position: 'absolute',
        width: '100%',
        ...p,
      }}
    ></Box>
  );
};

const Page = ({
  children,
  fullWidth = false,
}: {
  fullWidth?: boolean;
  children: ReactNode;
}) => (
  <Box>
    <ScreenEdge position="top" />
    <Container maxWidth={fullWidth ? 'lg' : 'sm'}>{children}</Container>
    <ScreenEdge position="bottom" />
  </Box>
);

export default Page;
