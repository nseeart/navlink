import type { NextPage } from 'next';
import Head from 'next/head';
import { wrapper } from '@/globals/redux/store';
import { profile } from '@/modules/auth/api';
import { setToken, setUser } from '@/modules/auth/slice';
import { User } from '@/modules/auth/types';
import styles from '../site/styles/Detail.module.scss';
import { site } from '../site/api';
import { setSiteItem } from '../site/slice';
import { SiteItem } from '../site/types';
import Top from '../site/components/Top';
import Footer from '../site/components/Footer';
import Asider from '../site/components/Asider';
import Tools from '../site/components/Tools';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const uuid = params?.uuid || '';
      await store.dispatch(setToken(req.cookies.token || ''));
      const { data: user } = await store.dispatch(profile.initiate());
      await store.dispatch(setUser(user as User));
      const { data: siteItem } = await store.dispatch(
        site.initiate(uuid as string),
      );
      //   await store.dispatch(setSiteItem(siteItem as SiteItem));
      return {
        props: {
          siteItem,
        },
      };
    },
);

type DetailProps = {
  siteItem: SiteItem;
};

const Detail: NextPage<DetailProps> = ({ siteItem }: DetailProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>vue.design-detail</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Top />
      </header>
      <section className={styles.main}>
        {siteItem && (
          <article className={styles.article}>
            <h1>{siteItem.title}</h1>
            <div className={styles.meta}>
              <span>[{siteItem.type}]</span>
              <span> · </span>
              <time>{siteItem.createdAt}</time>
              <span> · </span>
              <span>阅读 {siteItem.views}</span>
            </div>
            <div className={styles.content}>{siteItem.description}</div>
          </article>
        )}
        <Asider uuid={siteItem.uuid} />
        <Tools />
      </section>
      <Footer />
    </div>
  );
};

export default Detail;
