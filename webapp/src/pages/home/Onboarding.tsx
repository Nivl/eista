import { Box, Button, Grid, Typography } from '@mui/material';

import Page from 'components/Page';
import useSkipOnboarding from 'hooks/useSkipOnboarding';

const Onboarding = () => {
  const {
    skipOnboarding,
    isLoading: isSkippingOnboarding,
    error: skippingError,
  } = useSkipOnboarding();

  const onSkipOnboarding = async () => {
    try {
      await skipOnboarding();
    } catch (_) {
      // we can just return here, because the error will be handled
      // by the hook
      return;
    }
    // The hook automatically updates the user, closing
    // this page automatically
  };

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
        <Grid
          component="form"
          container
          direction="column"
          spacing={2}
          columnSpacing={2}
        >
          <Grid item>
            <Typography variant="h3">Welcome</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              To get started you need to connect your bank account.
            </Typography>
          </Grid>
          <Grid
            container
            item
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button onClick={onSkipOnboarding}>Later</Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Connect</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default Onboarding;
