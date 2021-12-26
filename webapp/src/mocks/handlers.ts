import { graphql } from 'msw';

import { defaultUser, userFromToken } from './users';

export const handlers = [
  graphql.mutation('signIn', (req, res, ctx) => {
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

    return res(ctx.data({ me: defaultUser.me, token: defaultUser.token }));
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
