import { gql } from 'graphql-request';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';

import { request } from 'backend/request';
import { GraphQLError } from 'backend/types';
import { Me } from 'backend/types';
import { MeContext } from 'contexts/MeContext';

const skipOnboarding = async () => {
  const { skipOnboarding } = await request(
    gql`
      mutation skipOnboarding {
        skipOnboarding {
          id
          email
          name
          hasOnboarded
        }
      }
    `,
  );
  return skipOnboarding as Me;
};

export const useSkipOnboarding = () => {
  const { setMe } = useContext(MeContext);
  const { data, isLoading, isSuccess, mutateAsync, error } = useMutation<
    Me,
    Error | GraphQLError,
    void
  >(skipOnboarding);

  useEffect(() => {
    if (data) {
      setMe(data);
    }
  }, [data, setMe]);

  return {
    isLoading,
    error,
    isSuccess,
    skipOnboarding: mutateAsync,
  };
};
