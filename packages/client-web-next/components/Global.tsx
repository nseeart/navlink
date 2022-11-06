import ModalAuth from '@/components/ModalAuth';
import ModalSetting from '@/components/ModalSetting';
import Head from 'next/head';
import { FC } from 'react';

const Global: FC = () => {
    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/nav_16.png"></link>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/nav_32.png"></link>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="48x48"
                    href="/favicon/nav_48.png"></link>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="48x48"
                    href="/favicon/nav_64.png"></link>
            </Head>
            <ModalAuth />
            <ModalSetting />
        </>
    );
};

export default Global;
