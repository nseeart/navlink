import Head from 'next/head';
import type { NextPage } from 'next';
import styles from './styles/Home.module.scss';
import List from './components/List';
import Header from './components/Header';
import Footer from './components/Footer';
import { wrapper } from './redux/store';
import { navigations, sites } from './redux/services/client';
import { profile } from './redux/services/auth';
import { setToken } from './redux/features/authSlice';
// import { useAppDispatch } from './hooks/app';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // console.log('context.req.cookies.token', context.req);
    await store.dispatch(setToken(context.req.cookies.token || ''));
    await store.dispatch(navigations.initiate());
    await store.dispatch(sites.initiate());
    await store.dispatch(profile.initiate());
    return {
      props: {},
    };
  },
);

type HomeProps = {};

const Home: NextPage<HomeProps> = ({}: HomeProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>vue.design</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <List type="home" />
      <Footer />
    </div>
  );
};

export default Home;
