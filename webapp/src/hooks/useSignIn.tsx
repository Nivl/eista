import { gql } from 'graphql-request';
import { useMutation } from 'react-query';

import request from 'backend/request';
import { GraphQLError } from 'backend/types';

export type Input = {
  email: string;
  password: string;
};

type Payload = {
  credentials: Input;
};

const signIn = async (variables: Payload) => {
  const data = await request(
    gql`
      mutation signIn($credentials: Credentials!) {
        signIn(credentials: $credentials) {
          token
        }
      }
    `,
    variables,
  );

  console.log({ data });

  return data.token as string;
};

const useSignIn = () => {
  const mutation = useMutation<string, Error | GraphQLError, Payload>(signIn);

  return {
    isLoading: mutation.isLoading,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    signIn: (input: Input) => mutation.mutate({ credentials: input }),
  };
};

export default useSignIn;
