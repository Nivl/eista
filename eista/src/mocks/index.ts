const enableMSW = () => {
  if (typeof window === 'undefined') {
    const { server } = require('./server'); // eslint-disable-line @typescript-eslint/no-var-requires
    server.listen();
  } else {
    const { worker } = require('./browser'); // eslint-disable-line @typescript-eslint/no-var-requires
    worker.start({
      onUnhandledRequest(req: Request) {
        // eslint-disable-next-line no-console
        console.log(
          `Found an unhandled ${req.method} request to ${req.url}`,
          req.body,
        );
      },
    });
  }
};

export default enableMSW;
