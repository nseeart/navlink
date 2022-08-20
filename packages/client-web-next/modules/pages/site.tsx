import type { NextPage } from 'next';
import Head from 'next/head';
import { Badge } from 'antd';
import { GithubOne, Home, Like, ThumbsUp, ThumbsDown } from '@icon-park/react';
import { useState } from 'react';
import { wrapper } from '@/globals/redux/store';
import { profile } from '@/modules/auth/api';
import { setToken, setUser } from '@/modules/auth/slice';
import { User } from '@/modules/auth/types';
import styles from '../site/styles/Site.module.scss';
import { site } from '../site/api';
import { setSiteItem } from '../site/slice';
import { SiteItem } from '../site/types';
import Top from '../site/components/Top';
import Footer from '../site/components/Footer';
import Asider from '../site/components/Asider';
import Link from 'next/link';

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
      return {
        props: {
          siteItem,
        },
      };
    },
);

type SiteProps = {
  siteItem: SiteItem;
};

const Tools = () => {
  const [count, setCount] = useState(99);
  //  GithubOne, Home, Like, ThumbsUp, ThumbsDown
  const toolList = [
    {
      icon: (
        <ThumbsUp
          theme="outline"
          size="20"
          fill="#666"
          style={{ height: '20px' }}
        />
      ),
      badge: 99,
    },
    {
      icon: (
        <ThumbsDown
          theme="outline"
          size="20"
          fill="#666"
          style={{ height: '20px' }}
        />
      ),
      badge: 4,
    },
    {
      icon: (
        <Like
          theme="outline"
          size="20"
          fill="#666"
          style={{ height: '20px' }}
        />
      ),
      badge: 20,
    },
  ];
  return (
    <div className={styles.tools}>
      <ul>
        {toolList.map((item, index) => (
          <li key={index}>
            <span className={styles['tools-text']}>{item.badge}</span>
            <span className={styles['tools-btn']}>{item.icon}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Site: NextPage<SiteProps> = ({ siteItem }: SiteProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>vue.design-site</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <Top />
      </header>
      <section className={styles.main}>
        {siteItem && (
          <article className={styles.article}>
            <header className={styles.title}>
              <h1>{siteItem.title}</h1>
              <div className={styles.link}>
                <Link href={siteItem.codeUrl} target="_blank">
                  <span className={styles['link-btn']}>
                    <GithubOne
                      theme="outline"
                      size="16"
                      fill="#666"
                      style={{ height: '16px' }}
                    />
                  </span>
                </Link>
                <Link href={siteItem.siteUrl} target="_blank">
                  <span className={styles['link-btn']}>
                    <Home
                      theme="outline"
                      size="16"
                      fill="#666"
                      style={{ height: '16px' }}
                    />
                  </span>
                </Link>
              </div>
            </header>
            <div className={styles.meta}>
              <span>[{siteItem.type}]</span>
              <span> · </span>
              <time>{siteItem.createdAt}</time>
              <span> · </span>
              <span>阅读 {siteItem.views}</span>
            </div>
            <div className={styles.content}>{siteItem.description}</div>
            <Tools />
          </article>
        )}
        <Asider uuid={siteItem.uuid} />
      </section>
      <Footer />
    </div>
  );
};

export default Site;
