import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import styles from './Home.module.css';
import logo from './logo.svg';
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

  return (
    <header className={styles.header}>
      <Image src={logo} className={styles.logo} alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className={styles.link}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  );
};
