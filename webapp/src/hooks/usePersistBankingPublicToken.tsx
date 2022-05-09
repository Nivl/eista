import { gql } from 'graphql-request';
import { useMutation } from 'react-query';

import { request } from 'backend/request';
import { GraphQLError } from 'backend/types';

type Input = {
  plaidPublicToken: string;
};

type Payload = {
  publicToken: Input;
};

const persistBankingPublicToken = async (variables: Payload) => {
  await request(
    gql`
      mutation persistBankingPublicToken($publicToken: BankingPublicToken!) {
        persistBankingPublicToken(publicToken: $publicToken)
      }
    `,
    variables,
  );
};

export const usePersistBankingPublicToken = () => {
  const { isLoading, isSuccess, mutateAsync, mutate, error } = useMutation<
    void,
    Error | GraphQLError,
    Payload
  >(persistBankingPublicToken);

  return {
    isLoading,
    error,
    isSuccess,
    persistBankingPublicToken: mutate,
    persistBankingPublicTokenAsync: mutateAsync,
  };
};
