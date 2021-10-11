import { Button, Grid, Typography } from '@mui/material';

const Setup = () => (
  <Grid
    container
    height="100vh"
    direction="column"
    justifyContent="center"
    alignItems="center"
  >
    <Typography variant="h2" gutterBottom>
      Welcome
    </Typography>

    <Typography variant="body1" gutterBottom>
      To get started you need to connect your bank account
    </Typography>

    <Button variant="contained" sx={{ marginTop: 2.6 }}>
      Connect
    </Button>
  </Grid>
);

export default Setup;
