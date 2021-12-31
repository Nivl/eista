import type { NextPage } from 'next';
import Image from 'next/image';

import styles from './Home.module.css';
import logo from './logo.svg';

const Home: NextPage = () => (
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

export default Home;
