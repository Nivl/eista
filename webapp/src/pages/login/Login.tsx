import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';

import { isGraphQLError } from 'backend/types';
import Loading from 'components/Loader';
import Page from 'components/Page';
import MeContext from 'contexts/MeContext';
import useSignIn, { Input as SignInInput } from 'hooks/useSignIn';

type ServerErrors = {
  [key: string]: string[];
};

const Login = () => {
  const navigate = useNavigate();
  const { me, isLoading: isPageLoading } = useContext(MeContext);
  const {
    isLoading: isSigningUp,
    isSuccess: signUpSuccess,
    error: signUpError,
    data: signUpResult,
    signIn,
  } = useSignIn();

  // Hooks to parse the server errors
  const [serverError, setServerError] = useState<ServerErrors>({});
  useEffect(() => {
    if (signUpError && isGraphQLError(signUpError)) {
      const errors: ServerErrors = {};
      signUpError.response.errors.forEach(e => {
        if (!errors[e.extensions.field]) {
          errors[e.extensions.field] = [];
        }
        errors[e.extensions.field].push(e.message);
      });
      setServerError(errors);
    }
  }, [signUpError]);

  useEffect(() => {
    if (signUpSuccess && signUpResult) {
      window.localStorage.setItem('api_access_token', signUpResult);
      navigate('/');
    }
  }, [navigate, signUpSuccess, signUpResult]);

  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const { errors: formErrors, isValid: formIsValid } = formState;

  const onSubmit = (result: SignInInput) => {
    signIn(result);
  };

  if (me) {
    return <Navigate to="/" replace={true} />;
  }

  if (isPageLoading) {
    return <Loading fullPage />;
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
        <Grid component="form" container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h3">Sign In</Typography>
          </Grid>

          {serverError['_'] && (
            <Grid item>
              {serverError['_'].map(e => (
                <Typography
                  key={e}
                  variant="body2"
                  sx={{
                    color: 'error.main',
                  }}
                >
                  {e}
                </Typography>
              ))}
            </Grid>
          )}

          <Grid item>
            <TextField
              fullWidth
              {...register('email', {
                required: true,
                maxLength: 255,
                pattern: /^.+@.+$/i,
              })}
              error={!!formErrors.email}
              id="email"
              label="E-mail"
              variant="outlined"
              helperText={
                (formErrors.email &&
                  ((formErrors.email.type == 'required' &&
                    'Please enter an email address') ||
                    (formErrors.email.type == 'pattern' &&
                      'Please enter a valid email address') ||
                    (formErrors.email.type == 'maxLength' &&
                      'E-mail address should be less or equal to 255 chars') ||
                    'default')) ||
                (serverError['email'] && serverError['email'][0])
              }
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              {...register('password', {
                required: true,
                maxLength: 255,
              })}
              error={!!formErrors.password}
              id="password"
              label="Password"
              variant="outlined"
              helperText={
                (formErrors.password &&
                  ((formErrors.password.type == 'maxLength' &&
                    'password should be less or equal to 255 chars') ||
                    'default')) ||
                (serverError['password'] && serverError['password'][0])
              }
            />
          </Grid>

          <Grid item>
            {!isSigningUp ? (
              <Button
                disabled={formIsValid ? false : true}
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
              >
                Sign in
              </Button>
            ) : (
              <LoadingButton fullWidth loading variant="contained" />
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
