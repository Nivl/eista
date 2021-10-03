import { Box, CircularProgress, Container, Typography } from '@mui/material';

export type Props = {
  hideText?: boolean;
  text?: string;
  isSmall?: boolean;
  fullPage?: boolean;
};

const Loading = ({
  hideText = false,
  text = 'Loading...',
  isSmall = false,
  fullPage = false,
}: Props) => (
  <Container>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: fullPage ? '100vh' : '',
      }}
    >
      <CircularProgress size={isSmall ? 20 : 40} />
      {!hideText && !isSmall && (
        <Typography
          variant="body2"
          sx={{
            marginTop: 2,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  </Container>
);

export default Loading;
