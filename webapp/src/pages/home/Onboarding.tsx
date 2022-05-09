import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Grid, Snackbar, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link';

import { GraphQLError } from 'backend/types';
import { Loading } from 'components/Loading';
import { Page } from 'components/Page';
import { useGenerateBankingLinkToken } from 'hooks/useGenerateBankingLinkToken';
import { usePersistBankingPublicToken } from 'hooks/usePersistBankingPublicToken';
import { useSkipOnboarding } from 'hooks/useSkipOnboarding';

// TODO(melvin):
// - Update the backend to mark the user as onboarded.
// Manually update the user state instead of waiting for a me object

const PlaidLinkButton = ({
  plaidLinkToken,
  onError,
}: {
  plaidLinkToken: string;
  onError?: (error: ErrorEvent | GraphQLError | Error | null) => void;
  onDone?: () => void;
}) => {
  const {
    isLoading: isPersistingToken,
    persistBankingPublicTokenAsync,
    error: errorPersistingToken,
  } = usePersistBankingPublicToken();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, _) => {
      // TODO(melvin): Maybe send the institution ID with it
      await persistBankingPublicTokenAsync({
        publicToken: { plaidPublicToken: publicToken },
      });
    },
    [persistBankingPublicTokenAsync],
  );

  const config: PlaidLinkOptions = {
    token: plaidLinkToken,
    onSuccess,
  };

  const { open, ready, error: plaidLinkError } = usePlaidLink(config);

  useEffect(() => {
    if (onError) {
      onError(plaidLinkError || errorPersistingToken);
    }
  }, [plaidLinkError, errorPersistingToken, onError]);

  if (!ready || isPersistingToken) {
    return (
      <LoadingButton fullWidth loading variant="contained">
        Loading
      </LoadingButton>
    );
  }

  return (
    <Button variant="contained" onClick={() => open()}>
      Connect
    </Button>
  );
};

export const Onboarding = () => {
  const {
    skipOnboarding,
    isLoading: isSkippingOnboarding,
    error: errorSkippingOnboarding,
  } = useSkipOnboarding();

  const {
    data: publicToken,
    generateLinkToken,
    isLoading: isGeneratingLink,
    error: errorGeneratingLink,
  } = useGenerateBankingLinkToken();

  const [plaidError, setPlaidError] = useState<
    ErrorEvent | Error | GraphQLError | null
  >(null);

  useEffect(() => {
    generateLinkToken();
  }, [generateLinkToken]);

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

  if (isSkippingOnboarding) {
    return <Loading fullPage />;
  }

  return (
    <>
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
                {isGeneratingLink || errorGeneratingLink || !publicToken ? (
                  <LoadingButton fullWidth loading variant="contained">
                    Loading
                  </LoadingButton>
                ) : (
                  <PlaidLinkButton
                    plaidLinkToken={publicToken.plaidLinkToken}
                    onError={setPlaidError}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Page>
      <Snackbar
        open={!!errorGeneratingLink || !!plaidError}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert severity="error" variant="filled">
          {errorSkippingOnboarding
            ? 'Something went wrong.'
            : 'Something went wrong trying to connect to our banking provider.'}
        </Alert>
      </Snackbar>
    </>
  );
};
