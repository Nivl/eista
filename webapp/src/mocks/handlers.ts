import { graphql } from 'msw';

import {
  newAuthenticationError,
  newConflictError,
  newForbidenError,
  newValidationError,
} from './errors';
import { defaultUser, userFromToken, users } from './users';

export const handlers = [
  graphql.mutation('signIn', (req, res, ctx) => {
    let user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return res(
        ctx.errors([
          newForbidenError({ message: 'user is already logged in' }),
        ]),
      );
    }

    const email = req?.body?.variables?.credentials?.email;
    user = users.find(user => user.me.email === email);
    if (!user) {
      return res(
        ctx.errors([
          newValidationError({
            message: 'Invalid email or password',
            field: '_',
          }),
        ]),
      );
    }

    return res(
      ctx.data({
        signIn: { me: user.me, session: { token: user.token } },
      }),
    );
  }),

  // john.doe@domain.tld will sign up and sign in the user
  // Any other existing users will fail
  // Any un-existing users will work to sign up but fail to sign in
  graphql.mutation('createUser', (req, res, ctx) => {
    let user = userFromToken(localStorage.getItem('user_access_token'));
    if (user) {
      return res(
        ctx.errors([
          newForbidenError({ message: 'user is already logged in' }),
        ]),
      );
    }

    const email = req?.body?.variables?.credentials?.email;
    user = users.find(user => user.me.email === email);
    if (user && user != defaultUser) {
      return res(
        ctx.errors([
          newConflictError({ message: 'already in use', field: 'email' }),
        ]),
      );
    }

    return res(ctx.data({}));
  }),

  graphql.query('me', (req, res, ctx) => {
    const user = userFromToken(localStorage.getItem('user_access_token'));
    if (!user) {
      return res(ctx.errors([newAuthenticationError()]));
    }

    return res(
      ctx.data({
        me: user.me,
      }),
    );
  }),
];
