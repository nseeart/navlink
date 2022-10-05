import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, Alert } from 'antd';
import {
    selectIsSettingVisible,
    setIsSettingVisible,
} from '@/modules/features/globalSlice';
import {
    useProfileQuery,
    useUpdateProfileMutation,
} from '@/modules/services/authApi';
import styles from './ModalSetting.module.scss';
import { useEffect, FC, useState } from 'react';
import { debounce } from 'lodash-es';
import { diffObject } from '@/modules/utils';
import UploadAvatar from '../UploadAvatar';

const ModalSetting: FC = () => {
    const [form] = Form.useForm();
    const isSettingVisible = useSelector(selectIsSettingVisible);
    const dispatch = useDispatch();
    const { data: profile, refetch } = useProfileQuery();
    const [update] = useUpdateProfileMutation();
    const [cacheData, setDataCache] = useState({});
    useEffect(() => {
        profile && setDataCache(profile);
        isSettingVisible && profile && form.setFieldsValue(profile);
    }, [profile, isSettingVisible]);

    const formFileds = ['avatar', 'nickname', 'username', 'email', 'phone'];

    const handleCancel = () => {
        dispatch(setIsSettingVisible(false));
    };

    const [isSave, setIsSave] = useState(false);
    const [alerText, setAlerText] = useState('数据没变化，无需保存！');

    const onFinish = (values: any) => {
        if (diffObject(cacheData, values)) {
            return;
        }

        update(values)
            .then((res: any) => {
                if (res && res.data) {
                    setAlerText('数据保存成功！');
                    setIsSave(true);
                    refetch();
                }
            })
            .catch(() => {
                setAlerText('数据保存失败！');
            })
            .finally(() => {
                setTimeout(() => {
                    setAlerText('数据没变化，无需保存！');
                }, 300);
            });
    };

    const handleFocus = () => {};
    let timer: ReturnType<typeof setTimeout>;
    const handleBlue = () => {
        const formData = form.getFieldsValue(formFileds);
        if (diffObject(cacheData, formData)) {
            return;
        }
        form.submit();
    };

    const handleChange = debounce(() => {
        // form.submit();
        const formData = form.getFieldsValue(formFileds);
        setIsSave(diffObject(cacheData, formData));
    }, 200);

    const handleOk = () => {
        form.submit();
    };
    const handleUploadFinish = () => {};
    return (
        <Modal
            width={600}
            open={isSettingVisible}
            title="我的设置"
            centered
            onCancel={handleCancel}
            cancelText={'关闭'}
            onOk={handleOk}
            okText={'保存'}
            okButtonProps={{ disabled: isSave }}
            wrapClassName="modal-setting"
            zIndex={2000}>
            <div className={styles['alert']}>
                <Alert message={alerText} type="warning" />
            </div>
            <div>
                <Form
                    form={form}
                    labelAlign="left"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    layout="horizontal">
                    <Form.Item label="头像" name="avatar" valuePropName="src">
                        <UploadAvatar
                            finish={handleUploadFinish}></UploadAvatar>
                    </Form.Item>
                    <Form.Item label="昵称" name="nickname">
                        <Input
                            onBlur={handleBlue}
                            onFocus={handleFocus}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="用户名" name="username">
                        <Input
                            onBlur={handleBlue}
                            onFocus={handleFocus}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="邮箱" name="email">
                        <Input
                            onBlur={handleBlue}
                            onFocus={handleFocus}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="手机号" name="phone">
                        <Input
                            onBlur={handleBlue}
                            onFocus={handleFocus}
                            onChange={handleChange}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default ModalSetting;
