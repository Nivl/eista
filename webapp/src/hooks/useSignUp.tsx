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

const signUp = async (variables: Payload) => {
  const data = await request(
    gql`
      mutation signUp($credentials: Credentials!) {
        signUp(credentials: $credentials) {
          token
        }
      }
    `,
    variables,
  );

  return data.token as string;
};

const useSignUp = () => {
  const mutation = useMutation<string, Error | GraphQLError, Payload>(signUp);

  return {
    isLoading: mutation.isLoading,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    signUp: (input: Input) => mutation.mutate({ credentials: input }),
  };
};

export default useSignUp;
