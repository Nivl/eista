import { gql } from 'graphql-request';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';

import request from 'backend/request';
import { GraphQLError, Me, Session } from 'backend/types';
import MeContext from 'contexts/MeContext';

export type Input = {
  email: string;
  password: string;
};

type Payload = {
  credentials: Input;
};

type Response = {
  me: Me;
  session: Session;
};

const signIn = async (variables: Payload) => {
  const { signIn } = await request(
    gql`
      mutation signIn($credentials: Credentials!) {
        signIn(credentials: $credentials) {
          me {
            id
            email
            name
          }
          session {
            token
          }
        }
      }
    `,
    variables,
  );

  return signIn as Response;
};

const useSignIn = () => {
  const { setMe } = useContext(MeContext);
  const { isLoading, data, isSuccess, mutateAsync, error } = useMutation<
    Response,
    Error | GraphQLError,
    Payload
  >(signIn);

  useEffect(() => {
    if (data) {
      localStorage.setItem('user_access_token', data.session.token);
      setMe(data.me);
    }
  }, [data, setMe]);

  return {
    isLoading: isLoading,
    error: error,
    isSuccess,
    data: data?.me,
    signIn: async (input: Input) => {
      const res = await mutateAsync({ credentials: input });
      return res.me;
    },
  };
};

export default useSignIn;
