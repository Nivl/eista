import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import { Dashboard } from './Dashboard';
import { Onboarding } from './Onboarding';
import { Loading } from 'components/Loading';
import { MeContext } from 'contexts/MeContext';

export const Home: NextPage = () => {
  const router = useRouter();
  const { me, isLoading: isPageLoading } = useContext(MeContext);

  if (isPageLoading) {
    return <Loading fullPage />;
  }

  if (!me) {
    router.replace('/login');
    return <Loading fullPage />;
  }

  if (!me.hasOnboarded) {
    return <Onboarding />;
  }

  return <Dashboard />;
};
