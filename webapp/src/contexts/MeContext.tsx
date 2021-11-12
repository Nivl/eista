import { gql } from 'graphql-request';
import { createContext } from 'react';
import { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Me } from '../backend/types';
import request from 'backend/request';

const getMe = async () => {
  const { me } = await request(
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

export const MeProvider: FC = ({ children }) => {
  const [me, setMe] = useState<Me | null>(null);

  const { data, isLoading, isError, error } = useQuery('me', getMe, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    retry: false,
  });
  useEffect(() => {
    if (data) {
      setMe(data);
    }
  }, [data]);

  return (
    <MeContext.Provider
      value={{ me: data || me, setMe, isLoading, isError, error }}
    >
      {children}
    </MeContext.Provider>
  );
};

const MeContext = createContext<{
  me: Me | null;
  setMe: (_: Me | null) => void;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}>({
  me: null,
  setMe: () => null,
  isLoading: false,
  isError: false,
});

export default MeContext;
