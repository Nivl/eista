import { graphql } from 'msw';

import { userFromToken, users } from './users';

export const handlers = [
  graphql.mutation('signIn', (req, res, ctx) => {
    let user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return res(
        ctx.errors([
          {
            message: 'user is already logged in',
            errorType: 'ForbiddenError',
          },
        ]),
      );
    }

    const email = req?.body?.variables?.credentials?.email;
    user = users.find(user => user.me.email === email);
    if (!user) {
      return res(
        ctx.errors([
          {
            message: 'Invalid email or password',
            errorType: 'ValidationError',
          },
        ]),
      );
    }

    return res(
      ctx.data({
        signIn: { me: user.me, session: { token: user.token } },
      }),
    );
  }),

  graphql.mutation('signUp', (req, res, ctx) => {
    const user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return res(
        ctx.errors([
          {
            message: 'user is already logged in',
            errorType: 'ForbiddenError',
          },
        ]),
      );
    }

    return res(ctx.data({}));
  }),

  graphql.query('me', (req, res, ctx) => {
    const user = userFromToken(localStorage.getItem('user_access_token'));
    if (!user) {
      return res(
        ctx.errors([
          {
            message: 'Not authenticated',
            errorType: 'AuthenticationError',
          },
        ]),
      );
    }

    return res(
      ctx.data({
        me: user.me,
      }),
    );
  }),
];
