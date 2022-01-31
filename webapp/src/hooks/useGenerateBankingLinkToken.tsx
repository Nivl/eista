import { gql } from 'graphql-request';
import { useMutation } from 'react-query';

import request from 'backend/request';
import { GraphQLError } from 'backend/types';

type LinkToken = {
  plaidLinkToken: string;
};

const generateBankingLinkToken = async () => {
  const { generateBankingLinkToken } = await request(
    gql`
      mutation generateBankingLinkToken {
        generateBankingLinkToken {
          plaidLinkToken
        }
      }
    `,
  );
  return generateBankingLinkToken as LinkToken;
};

const useGenerateBankingLinkToken = () => {
  const { data, isLoading, isSuccess, mutateAsync, mutate, error } =
    useMutation<LinkToken, Error | GraphQLError, void>(
      generateBankingLinkToken,
    );

  return {
    data,
    isLoading,
    error,
    isSuccess,
    generateLinkToken: mutate,
    generateLinkTokenAsync: mutateAsync,
  };
};

export default useGenerateBankingLinkToken;
