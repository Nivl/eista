import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';

import Loading from 'components/Loader';
import Page from 'components/Page';
import MeContext from 'contexts/MeContext';

const Login = () => {
  const { me, isLoading: isPageLoading } = useContext(MeContext);
  const [isCheckingData, setIsCheckingData] = useState(false);

  if (me) {
    return <Navigate to="/" replace={true} />;
  }

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          height: '100vh',
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h3">Sign In</Typography>
          </Grid>

          <Grid item>
            <TextField fullWidth id="email" label="E-mail" variant="outlined" />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              id="password"
              label="Password"
              variant="outlined"
            />
          </Grid>

          <Grid item>
            {!isCheckingData ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => setIsCheckingData(true)}
              >
                Sign in
              </Button>
            ) : (
              <LoadingButton fullWidth loading variant="contained">
                Submit
              </LoadingButton>
            )}
          </Grid>

          <Grid item sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link to="/sign-up" component={RouterLink} underline="hover">
              Sign up
            </Link>
            .
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Login;
