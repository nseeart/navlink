import { FC } from 'react';
import logoImage from '@/assets/images/logo.png';
import usePopup, { MenuListItem } from './usePopup';
import styles from './Popup.module.scss';
import { Browser, Send } from '@icon-park/react';
import { IconRender } from '@/globals/utils/component';

const PopupApp: FC = () => {
    const { handleNewTab, handleRecommend, menuList } = usePopup();
    const hanldeCommand = ({ key }: MenuListItem) => {
        switch (key) {
            case 'new_tab':
                handleNewTab();
                break;
            case 'recommend':
                handleRecommend();
                break;
            default:
                break;
        }
    };
    return (
        <div className={styles['nav-link-popup']}>
            <header className={styles['nav-link-popup-header']}>
                <img src={'/assets/images/nav_48.png'} />
                <span className={styles.en}>av.Link</span>
                <span className={styles.zh}>导航链接</span>
            </header>
            <footer className={styles['nav-link-popup-content']}>
                <ul>
                    {menuList.map((item) => (
                        <li key={item.key} onClick={() => hanldeCommand(item)}>
                            <IconRender
                                map={{ Browser, Send }}
                                is={item.icon}
                                theme="outline"
                                size={18}
                                fill="#3d7eff"
                            />
                            <span className="text">{item.title}</span>
                        </li>
                    ))}
                </ul>
            </footer>
        </div>
    );
};

export default PopupApp;
