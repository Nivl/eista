import { gql } from 'graphql-request';
import { useMutation } from 'react-query';

import request from 'backend/request';
import { GraphQLError } from 'backend/types';

export type Input = {
  email: string;
  password: string;
  name: string;
};

type Payload = {
  newUser: Input;
};

const signUp = async (variables: Payload) => {
  await request(
    gql`
      mutation createUser($newUser: NewUser!) {
        createUser(newUser: $newUser)
      }
    `,
    variables,
  );
};

const useSignUp = () => {
  const mutation = useMutation<void, Error | GraphQLError, Payload>(signUp);

  return {
    isLoading: mutation.isLoading,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    signUp: (input: Input) => mutation.mutateAsync({ newUser: input }),
  };
};

export default useSignUp;
