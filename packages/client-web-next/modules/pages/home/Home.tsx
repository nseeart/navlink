import Head from 'next/head';
import type { NextPage } from 'next';
import { wrapper } from '@/modules/redux/store';
import { profile } from '@/modules/redux/services/authApi';
import { setToken } from '@/modules/redux/features/authSlice';
import { sites } from '@/modules/redux/services/siteApi';
import { navigations } from '@/modules/redux/services/navigationApi';
import { countProfile } from '@/modules/redux/services/countApi';
import List from '@/modules/components/List';
import Footer from '@/modules/components/Footer';
import Header from './components/Header';
import styles from './Home.module.scss';

// import { useAppDispatch } from './hooks/app';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await store.dispatch(setToken(context.req.cookies.token || ''));
    await store.dispatch(navigations.initiate());
    await store.dispatch(sites.initiate({}));
    await store.dispatch(profile.initiate());
    await store.dispatch(countProfile.initiate());
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
