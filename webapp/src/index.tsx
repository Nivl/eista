import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import App from 'components/App';

function prepare() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser'); // eslint-disable-line @typescript-eslint/no-var-requires
    return worker.start({
      onUnhandledRequest(req: Request) {
        // eslint-disable-next-line no-console
        console.log(
          `Found an unhandled ${req.method} request to ${req.url}`,
          req.body,
        );
      },
    });
  }
  return Promise.resolve();
}

prepare().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// TODO(melvin): log that somewhere (it's a no-op until a method is provided)
reportWebVitals();
