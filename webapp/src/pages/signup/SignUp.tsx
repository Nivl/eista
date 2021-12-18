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
import useSignUp, { Input as SignUpInput } from 'hooks/useSignUp';

type ServerErrors = {
  [key: string]: string[];
};

const SignUp = () => {
  const navigate = useNavigate();
  const { me, isLoading: isPageLoading } = useContext(MeContext);
  const { isLoading: isSigningUp, error: signUpError, signUp } = useSignUp();
  // We automatically sign in the user after sign up
  const { isLoading: isSigningIn, signIn } = useSignIn();

  // Hooks to parse the server errors
  const [serverError, setServerError] = useState<ServerErrors>({});
  useEffect(() => {
    if (signUpError && isGraphQLError(signUpError)) {
      const errors: ServerErrors = {};
      signUpError.response.errors.forEach(e => {
        const field = e.extensions?.field ?? '_';
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(e.message);
      });
      setServerError(errors);
    }
  }, [signUpError]);

  const { register, handleSubmit, formState, watch, trigger } = useForm({
    mode: 'onChange',
  });
  const { errors: formErrors, isValid: formIsValid } = formState;
  const password = watch('password');

  useEffect(() => {
    trigger('passwordAgain');
  }, [trigger, password]);

  const onSubmit = async (result: SignUpInput) => {
    try {
      await signUp({
        email: result.email,
        password: result.password,
        name: result.name,
      });
    } catch (_) {
      return;
    }

    try {
      await signIn({ email: result.email, password: result.password });
      navigate('/');
    } catch (error) {
      // TODO(melvin): Report error somewhere
      console.error('auto sign in error', { error });
      // In case of error we'll let the user try again manually
      navigate('/login');
    }
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
            <Typography variant="h3">Sign Up</Typography>
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
              {...register('name', {
                required: true,
                maxLength: 255,
              })}
              error={!!formErrors.name}
              id="name"
              label="Name"
              variant="outlined"
              helperText={
                (formErrors.name &&
                  ((formErrors.name.type == 'required' &&
                    'Please enter a name') ||
                    (formErrors.name.type == 'maxLength' &&
                      'Name should be less or equal to 255 chars') ||
                    'Invalid')) ||
                (serverError['name'] && serverError['name'][0])
              }
            />
          </Grid>

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
                    'Invalid')) ||
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
              type="password"
              helperText={
                (formErrors.password &&
                  ((formErrors.password.type == 'required' && 'Required') ||
                    (formErrors.password.type == 'maxLength' &&
                      'Password should be less or equal to 255 chars') ||
                    'Invalid')) ||
                (serverError['password'] && serverError['password'][0])
              }
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              {...register('passwordAgain', {
                maxLength: 255,
                validate: {
                  match: (passwordAgain: string) =>
                    !passwordAgain || passwordAgain === password
                      ? undefined
                      : 'Passwords do not match',
                },
              })}
              error={!!formErrors.passwordAgain}
              id="password-again"
              label="Password Again"
              variant="outlined"
              type="password"
              helperText={
                formErrors.passwordAgain &&
                ((formErrors.passwordAgain.type == 'maxLength' &&
                  'Password should be less or equal to 255 chars') ||
                  (formErrors.passwordAgain.type == 'required' && 'Required') ||
                  (formErrors.passwordAgain.type == 'match' &&
                    "Password don't match") ||
                  'Invalid')
              }
            />
          </Grid>

          <Grid item>
            {!isSigningUp && !isSigningIn ? (
              <Button
                disabled={formIsValid ? false : true}
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
              >
                Sign Up
              </Button>
            ) : (
              <LoadingButton fullWidth loading variant="contained" />
            )}
          </Grid>

          <Grid item sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link to="/login" component={RouterLink} underline="hover">
              Sign In
            </Link>
            .
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default SignUp;
