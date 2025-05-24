"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload } from "@/services/authService";

type FormFields = LoginPayload & { remember?: boolean };

export default function LoginPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: login,
  });

  const { mutateAsync, isPending } = mutation;

  const onFinish = async (values: FormFields) => {
    const { username, token, remember } = values;

    try {
      const user = await mutateAsync({ username, token });
      message.success("Login successful! Redirecting to dashboard...");
      if (remember) {
        localStorage.setItem("user", JSON.stringify({ username, token }));
      }
      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.message || "Invalid username or access token. Please check!");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check your input fields.");
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
      <Form.Item<FormFields>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please check your username" }]}
      >
        <Input placeholder="Input your email..." />
      </Form.Item>

      <Form.Item<FormFields>
        label="Token"
        name="token"
        rules={[{ required: true, message: "Please check your valid token" }]}
      >
        <Input.Password placeholder="Input your Go REST Access Token..." />
      </Form.Item>

      <Form.Item<FormFields> name="remember" valuePropName="checked" label={null}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}