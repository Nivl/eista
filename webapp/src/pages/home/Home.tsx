import logo from './logo.svg';
import styles from './Home.module.css';

const Home = () => (
  <header className={styles.header}>
    <img src={logo} className={styles.logo} alt="logo" />
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
