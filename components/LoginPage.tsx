"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';

type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const { username, password, remember } = values;

    if (username === 'validemail@example.com' && password === 'validtoken') {
      message.success('Login successful! Redirecting to dashboard...');
      if (remember) {
        localStorage.setItem('user', JSON.stringify({ username, password }));
      }
      router.push('/dashboard');
    } else {
      message.error('Invalid username or access token. Please check!');
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check your input fields.');
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please check your username' }]}
      >
        <Input placeholder="Input your email..." />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please check your valid token' }]}
      >
        <Input.Password placeholder="Input your Go REST Access Token..." />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;