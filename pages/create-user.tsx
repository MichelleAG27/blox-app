import React, { useState } from 'react';
import { Breadcrumb, Form, Input, Select, Button, Modal } from 'antd';
import dynamic from 'next/dynamic';
import axios from 'axios';
import CustomSider from '@/components/dashboard/CustomSidebar';

const { Option } = Select;
const DashboardFilled = dynamic(() => import('@ant-design/icons/DashboardFilled'), { ssr: false });

const CreateUser = () => {
    const [form] = Form.useForm();

    // State modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');

    const TOKEN = "8af7ee5d85481fde941984822384dc207556ab823cda124759b2919cce92a413";

    const handleFinish = async (values: any) => {
        try {
            const response = await axios.post(
                'https://gorest.co.in/public/v2/users',
                {
                    name: values.fullName,
                    gender: values.gender,
                    email: values.email,
                    status: values.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                setModalTitle('Success');
                setModalContent('User created successfully!');
                setModalStatus('success');
                setModalOpen(true);
                form.resetFields();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create user';
            setModalTitle('Error');
            setModalContent(errorMessage);
            setModalStatus('error');
            setModalOpen(true);
        }
    };

    const handleFinishFailed = (errorInfo: any) => {
        setModalTitle('Error');
        setModalContent('Please complete all required fields.');
        setModalStatus('error');
        setModalOpen(true);
    };

    return (
        <CustomSider>
            <div className="p-4">
                <span
                    style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        fontFamily: 'Sora, sans-serif',
                        color: '#000000',
                        marginBottom: '8px',
                        display: 'inline-block',
                    }}
                >
                    Blog Management
                </span>
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <>
                                    <DashboardFilled style={{ color: '#59A1A5', fontSize: 16 }} />
                                    <span style={{ fontWeight: '400', marginLeft: 8, color: '#59A1A5' }}>Dashboard</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <span className="sora-text" style={{ fontWeight: 600, fontSize: '14px' }}>
                                    Create User
                                </span>
                            ),
                        },
                    ]}
                />

                <div style={{ marginTop: 24, background: '#fff', borderRadius: 8 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        onFinishFailed={handleFinishFailed}
                        requiredMark={false}
                    >
                        <Form.Item
                            label={
                                <span>
                                    Full Name<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="fullName"
                            rules={[{ required: true, message: 'Full Name is required!' }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span>
                                    Gender<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="gender"
                            rules={[{ required: true, message: 'Gender is required!' }]}
                        >
                            <Select placeholder="Select gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={
                                <span>
                                    Email<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="email"
                            rules={[
                                { required: true, message: 'Email is required!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input placeholder="Enter email address" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span>
                                    Status<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="status"
                            rules={[{ required: true, message: 'Status is required!' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ backgroundColor: '#5cc8be', borderColor: '#5cc8be', alignItems: 'center', marginTop:'2em' }}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                {/* Modal */}
                <Modal
                    title={modalTitle}
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={[
                        <Button
                            key="ok"
                            type="primary"
                            onClick={() => setModalOpen(false)}
                            style={{ backgroundColor: '#5cc8be', borderColor: '#5cc8be', margin: '0 auto', display: 'block' }}
                        >
                            OK
                        </Button>,
                    ]}
                    centered
                    bodyStyle={{ textAlign: 'center' }}
                    modalRender={node => (
                        <>
                            <style>{`
        .ant-modal-title {
          text-align: center !important;
          width: 100%;
        }
      `}</style>
                            {node}
                        </>
                    )}
                >
                    <p>{modalContent}</p>
                </Modal>
            </div>
        </CustomSider>
    );
};

export default CreateUser;