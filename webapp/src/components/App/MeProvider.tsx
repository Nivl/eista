import { gql } from 'graphql-request';
import { FC, useState } from 'react';
import { useQuery } from 'react-query';

import request from 'backend/request';
import { Me } from 'backend/types';
import MeContext from 'contexts/me';

const getMe = async () => {
  const { me } = await request(
    '/me',
    gql`
      query {
        me {
          id
          email
          name
        }
      }
    `,
  );

  return me as Me;
};

const useMeBackend = () => {
  const { data, isLoading, isError, error } = useQuery('me', getMe, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return { data, isLoading, isError, error };
};

const MeProvider: FC = ({ children }) => {
  const [me, setMe] = useState<Me | null>(null);
  // TODO: no need to run if the users has no token
  //    remove token from localStorage on auth error
  const { data, isLoading, isError, error } = useMeBackend();
  if (data) {
    setMe(data);
  }

  return (
    <MeContext.Provider value={{ me, setMe, isLoading, isError, error }}>
      {children}
    </MeContext.Provider>
  );
};

export default MeProvider;
