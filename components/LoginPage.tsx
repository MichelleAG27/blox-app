"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload } from "@/services/authService";

type FormFields = LoginPayload & { remember?: boolean };

export default function LoginPage() {
  const [form] = Form.useForm<FormFields>();
  const router = useRouter();
  const mutation = useMutation({ mutationFn: login });
  const { mutateAsync, isPending } = mutation;
  const [isFormValid, setIsFormValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { email, token } = JSON.parse(storedUser);
      setTimeout(() => {
        form.setFieldsValue({ email, token, remember: true });
      }, 0);
      setIsFormValid(true);
    } else {
      const sessionUser = sessionStorage.getItem("user");
      if (sessionUser) {
        const { email, token } = JSON.parse(sessionUser);
        form.setFieldsValue({ email, token, remember: false });
        setIsFormValid(true);
      }
    }
  }, [form]);

  const onFieldsChange = () => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some(({ errors }) => errors.length > 0);
    const values = form.getFieldsValue(["email", "token"]);
    const allFilled = values.email && values.token;
    setIsFormValid(!hasErrors && allFilled);
  };

  const onFinish = async (values: FormFields) => {
    const { email, token, remember } = values;
    try {
      await mutateAsync({ email, token });

      setModalOpen(true);

      if (remember) {
        localStorage.setItem("user", JSON.stringify({ email, token }));
      } else {
        localStorage.removeItem("user");
      }

      setTimeout(() => {
        setModalOpen(false);
        setConfirmLoading(false);
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      message.error("Invalid email or access token. Please check!");
    }
  };

  return (
    <div
      style={{
        marginRight: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 32,
            marginLeft: 24,
            maxWidth: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div>
            <div
              style={{
                textAlign: "center",
                marginBottom: "2em",
                display: "flex",
                gap: "1em",
              }}
            >
              <img
                src="/logo-navbar.png"
                alt="Logo"
                style={{ height: 50, objectFit: "contain" }}
              />
              <h1
                style={{
                  fontWeight: "bold",
                  marginTop: "5px",
                  justifyContent: "center",
                  fontSize: "32px",
                }}
              >
                BloX App
              </h1>
            </div>

            <h4
              style={{
                fontWeight: "bold",
                marginTop: "1em",
                paddingBottom: "24px",
                display: "inline-block",
                fontSize: "24px",
              }}
            >
              Login
            </h4>
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              onFieldsChange={onFieldsChange}
              autoComplete="off"
              requiredMark={false}
            >
              <div style={{ marginBottom: "1.5em" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                  htmlFor="email"
                >
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
                  validateTrigger={["onChange", "onBlur"]}
                  noStyle
                >
                  <Input
                    id="email"
                    placeholder="Input your email..."
                    style={{ fontSize: 14, fontWeight: 400, width: "75%" }}
                  />
                </Form.Item>
              </div>

              <div style={{ marginBottom: "1.5em" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                  htmlFor="token"
                >
                  Access Token <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="token"
                rules={[{ required: true, message: "Please enter your token" }]}
                  validateTrigger={["onChange", "onBlur"]}
                  noStyle
                >
                  <Input.Password
                    id="token"
                    placeholder="Input your Go REST Access Token..."
                    style={{ fontSize: 14, fontWeight: 400, width: "75%" }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{
                  justifyContent: "flex-start",
                  marginBottom: 8,
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item label={null} wrapperCol={{ span: 18 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: isFormValid ? "#5cc8BE" : "#D3D3D3",
                  }}
                  disabled={!isFormValid}
                >
                  Login
                </Button>
              </Form.Item>
              <footer
                style={{
                  textAlign: "center",
                  paddingTop: "2em",
                  paddingRight:"4rem",
                  fontSize: "12px",
                  color: "#999",
                  width:"85%",
                }}
              >
                <h4>
                  Copyright © 2025 <strong>BloX App</strong> <br />
                  All Rights Reserved <br />
                  App version 1.0.0
                </h4>
              </footer>
            </Form>
          </div>
        </div>

        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src="/login-image.png"
            alt="Login Illustration"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        <Modal
          title="Login Successful"
          open={modalOpen}
          confirmLoading={confirmLoading}
          footer={null}
          onCancel={() => setModalOpen(false)}
        >
          <p>You have successfully logged in! Redirecting to the dashboard...</p>
        </Modal>
      </div>
    </div>
  );
}