import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

export const FourOhFour: NextPage = () => (
  <>
    <Head>
      <title>Page Not Found</title>
    </Head>

    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          height: '100vh',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            pr: 3,
            mr: 3,
            borderRight: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="body2">This page could not be found.</Typography>
      </Box>
    </Container>
  </>
);
