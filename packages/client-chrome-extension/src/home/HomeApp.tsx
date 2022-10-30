import { FC } from 'react';
import HomeHeader from '../components/HomeHeader';
import List from '../components/List';
import Bottom from '../components/Bottom';
import Footer from '../components/Footer';
import ModalAuth from '../components/ModalAuth';
import ModalSetting from '../components/ModalSetting';
import ModalPush from '@/components/ModalPush';
import { useDispatch } from 'react-redux';
import { setInfo, setVisible } from '@/globals/features/pluginSlice';
import { setToken } from '@/globals/features/authSlice';
import { localGet } from '@/globals/utils/chrome';
import { details } from '@/configs/globals.contants';

const Home: FC = () => {
    const params = {
        page: 1,
        size: 20,
    };
    const dispatch = useDispatch();
    localGet('info', (data: Record<string, any>) => {
        console.log('info get', data);
        dispatch(setInfo(data.info));
    });
    localGet('visible', (data: Record<string, any>) => {
        console.log('visible get', data);
        dispatch(setVisible(data.visible));
    });
    try {
        chrome.cookies.get(details, (cookie: Record<string, string>) => {
            if (cookie && cookie.value) {
                console.log('cookie.value===', cookie.value, '=======');
                dispatch(setToken(cookie.value));
            }
        });
    } catch (error) {
        console.log('error chrome', error);
    }
    return (
        <div className="Home">
            <HomeHeader />
            <List pageType="home" params={params} />
            <Bottom />
            <Footer />
            <ModalAuth />
            <ModalSetting />
            <ModalPush />
        </div>
    );
};

export default Home;
