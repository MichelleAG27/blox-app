"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload } from "@/services/authService";

type FormFields = LoginPayload & { remember?: boolean };

export default function LoginPage() {
    const [form] = Form.useForm<FormFields>();
    const router = useRouter();
    const mutation = useMutation({ mutationFn: login });
    const { mutateAsync, isPending } = mutation;
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const { email, token } = JSON.parse(storedUser);
            form.setFieldsValue({ email, token, remember: true });
            setIsFormValid(true);
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
            message.success("Login successful! Redirecting to dashboard...");
            if (remember) {
                localStorage.setItem("user", JSON.stringify({ email, token }));
            } else {
                localStorage.removeItem("user");
            }

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (error: any) {
            message.error("Invalid email or access token. Please check!");
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Please check your input fields.");
    };

    return (
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
            <div style={{ flex: 1, paddingLeft: 32, paddingRight: 24, maxWidth: 600 }}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onFieldsChange={onFieldsChange}
                    autoComplete="off"
                    requiredMark={false}
                >
                    {/* Email */}
                    <Form.Item<FormFields>
                        name="email"
                        rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Please enter a valid email address" },
                        ]}
                        validateTrigger={["onChange", "onBlur"]}
                        style={{ marginBottom: "1.5em" }}
                    >
                        <div style={{ marginBottom: "0.5em", display: "flex"}}>
                            <span>Email</span>
                            <span style={{ color: "red" }}>*</span>
                        </div>
                        <Input placeholder="Input your email..." />
                    </Form.Item>

                    {/* Access Token */}
                    <Form.Item<FormFields>
                        name="token"
                        rules={[{ required: true, message: "Please enter your token" }]}
                        validateTrigger={["onChange", "onBlur"]}
                        style={{ marginBottom: "1.5em" }}
                    >
                        <div style={{ marginBottom: "0.5em", display: "flex"}}>
                            <span>Access Token</span>
                            <span style={{ color: "red" }}>*</span>
                        </div>
                        <Input.Password placeholder="Input your Go REST Access Token..." />
                    </Form.Item>

                    {/* Remember Me */}
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        style={{
                            justifyContent: "flex-start",
                            marginBottom: 8,
                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item label={null} wrapperCol={{ span: 20 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            style={{ width: "100%" }}
                            disabled={!isFormValid}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

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
        </div>
    );
}