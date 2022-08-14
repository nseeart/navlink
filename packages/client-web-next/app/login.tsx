import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Divider, Form, Input, Button, Checkbox } from 'antd';
import { User, Lock } from '@icon-park/react';
// import { loginData } from "../globals/apis";
import { TOKEN_KEY } from './redux/globals.contants';
import styles from './styles/Login.module.scss';
import { useLoginMutation, LoginRequest } from './redux/services/auth';
import { setToken, setUser } from './redux/features/authSlice';
import { useDispatch } from 'react-redux';

const Login: NextPage<any> = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const onFinish = (values: LoginRequest) => {
    login(values).then((res: any) => {
      if (res && res.data) {
        window.localStorage.setItem(TOKEN_KEY, res.data.token);
        dispatch(setToken(res.data.token));
        dispatch(setUser(res.data.user));
        router.push('/');
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const rules = {
    account: [{ required: true, message: '请输入用户名称!' }],
    password: [{ required: true, message: '请输入用户密码!' }],
  };

  const [account, setAccount] = useState('18602042484');
  const [password, setPassword] = useState('string');

  return (
    <div className={styles.container}>
      <Head>
        <title>vue.design</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles['left-inner']}>
              <Divider orientation="left">登录</Divider>
              <Form
                form={form}
                name="basic"
                initialValues={{ remember: true, account, password }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item name="account" rules={rules.account}>
                  <Input prefix={<User />} />
                </Form.Item>

                <Form.Item name="password" rules={rules.password}>
                  <Input.Password prefix={<Lock />} />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" block htmlType="submit">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
