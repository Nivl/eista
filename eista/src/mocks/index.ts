/* eslint-disable no-console, @typescript-eslint/no-var-requires */

const enableMSW = () => {
  if (typeof window === 'undefined') {
    const { server } = require('./server');
    server.listen();
  } else {
    const { worker } = require('./browser');
    worker.start({
      onUnhandledRequest(req: Request) {
        console.log(
          `Found an unhandled ${req.method} request to ${req.url}`,
          req.body,
        );
      },
    });
  }
};

export default enableMSW;
