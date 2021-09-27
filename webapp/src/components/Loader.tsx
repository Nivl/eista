import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export type Props = {
  hideText?: boolean;
  text?: string;
  isSmall?: boolean;
};

const Loading = ({
  hideText = false,
  text = 'Loading...',
  isSmall = false,
}: Props) => (
  <Container>
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item xs={12}>
        <CircularProgress size={isSmall ? 20 : 40} />
      </Grid>
      {!hideText && !isSmall && (
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            {text}
          </Typography>
        </Grid>
      )}
    </Grid>
  </Container>
);

export default Loading;
