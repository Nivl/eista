import { gql } from 'graphql-request';
import { createContext } from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { request } from 'backend/request';
import { Me } from 'backend/types';

export interface MeContextInterface {
  me: Me | null;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  setMe: (_: Me | null) => void;
}

const getMe = async () => {
  const { me } = await request(
    gql`
      query me {
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

export const MeProvider = ({ children }: { children: ReactNode }) => {
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

  const toProvide: MeContextInterface = {
    me: data || me,
    setMe,
    isLoading,
    isError,
    error,
  };

  return <MeContext.Provider value={toProvide}>{children}</MeContext.Provider>;
};

export const MeContext = createContext<{
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
