import styles from './Bottom.module.scss';
import { RankingList, TagOne } from '@icon-park/react';
import { useTagsQuery } from '@/globals/services/tagApi';
import { useUsersQuery } from '@/globals/services/userApi';
import Link from 'next/link';

const Bottom = () => {
    const { data: tags } = useTagsQuery();
    const { data: users } = useUsersQuery({
        size: 12,
    });
    const tagList = tags?.list || [];
    const userList = users?.list || [];
    console.log('users', userList);
    console.log('tags', tagList);
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <dl className={styles.author}>
                    <dt>
                        <RankingList theme="outline" size="24" />
                        <span className={styles.title}>作者排行榜</span>
                    </dt>
                    <dd>
                        {userList &&
                            userList.map((item, key) => {
                                return (
                                    <Link
                                        href={`/users/[uuid]`}
                                        as={`/users/${item.uuid}`}
                                        key={key}>
                                        <dl className={styles['user-item']}>
                                            <dt
                                                style={{
                                                    backgroundImage: `url(${item.avatar})`,
                                                }}></dt>
                                            <dd>
                                                <h5>
                                                    {item.nickname ||
                                                        item.username}
                                                </h5>
                                            </dd>
                                        </dl>
                                    </Link>
                                );
                            })}
                    </dd>
                </dl>
                <dl className={styles.tags}>
                    <dt>
                        <TagOne theme="outline" size="24" />
                        <span className={styles.title}>标签云</span>
                    </dt>
                    <dd>
                        {tagList &&
                            tagList.map((item, key) => (
                                <span key={key} data-id={item.id}>
                                    {item.name}
                                </span>
                            ))}
                    </dd>
                </dl>
            </div>
        </div>
    );
};

export default Bottom;
