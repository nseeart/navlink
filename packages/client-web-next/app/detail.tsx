import type { NextPage } from 'next';
import Head from 'next/head';
import styles from './styles/Detail.module.scss';
import Top from './components/Top';
import Footer from './components/Footer';
import { wrapper } from './redux/store';
import { site, useSiteQuery } from './redux/services/client';
import { profile, useProfileQuery } from './redux/services/auth';
import { setToken } from './redux/features/authSlice';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const uuid = params?.uuid || '';
      await store.dispatch(setToken(req.cookies.token || ''));
      await store.dispatch(profile.initiate());
      await store.dispatch(site.initiate(uuid as string));
      return {
        props: {
          uuid,
        },
      };
    },
);

type DetailProps = {
  uuid: string;
};

const Detail: NextPage<DetailProps> = ({ uuid }: DetailProps) => {
  const { data: detail } = useSiteQuery(uuid);
  const { data: profile } = useProfileQuery();
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
        {detail && (
          <section className={styles.content}>
            <h1>{detail.title}</h1>
            <div>
              <span>[{detail.type}]</span>
              <span> · </span>
              <span>{detail.createdAt}</span>
              <span> · </span>
              <span>阅读 {detail.views}</span>
            </div>
            <div>{detail.description}</div>
          </section>
        )}
        <aside className={styles.aside}>
          {profile && (
            <div>
              <dl>
                <dt>
                  <Avatar src={profile.avatar} icon={<UserOutlined />} />
                </dt>
                <dd>
                  <h5>{profile.username}</h5>
                </dd>
              </dl>
            </div>
          )}
        </aside>
      </section>
      <Footer />
    </div>
  );
};

export default Detail;
