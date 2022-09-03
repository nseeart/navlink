import type { NextPage } from 'next';
import Head from 'next/head';
import List from '@/modules/components/List';
import Top from '@/modules/components/Top';
import Footer from '@/modules/components/Footer';
// import Nav from './components/Nav';
import styles from './User.module.scss';
import { wrapper } from '@/modules/redux/store';
import { sites } from '@/modules/redux/services/siteApi';
import { user } from '@/modules/redux/services/userApi';
import { getUuid } from '@/globals/utils';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const uuid = getUuid(context.params!.uuid);
    const { data: userData } = await store.dispatch(user.initiate(uuid));
    console.log('userData', userData);
    await store.dispatch(
      sites.initiate({
        page: 1,
        size: 20,
        authorId: userData.id,
      }),
    );
    return {
      props: {},
    };
  },
);

type UserProps = {};

const User: NextPage<UserProps> = ({}: UserProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>vue.design-profile</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Top />
      </header>
      <section className={styles.main}>{/* <Nav /> */}</section>
      <List type="find" />
      <Footer />
    </div>
  );
};

export default User;
