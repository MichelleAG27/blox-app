import React, { useState, useEffect } from 'react';
import { Breadcrumb, Form, Input, Select, Button, Modal, Divider } from 'antd';
import dynamic from 'next/dynamic';
import axios from 'axios';
import CustomSider from '@/components/dashboard/CustomSidebar';

const { Option } = Select;
const { TextArea } = Input;

const DashboardFilled = dynamic(() => import('@ant-design/icons/DashboardFilled'), { ssr: false });
const TOKEN = "b9d911c7c7d57324f6ea3ef68d9a04f78b803dcfcefd33cd6ff4c1428ac684e4";

const CreatePost = () => {
    const [form] = Form.useForm();

    // Modal PopUp State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');

    // User Dropdown State
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    useEffect(() => {
        const fetchAllUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await axios.get('https://gorest.co.in/public/v2/users?page=1&per_page=100');
                setUsers(
                    res.data.map((user: any) => ({
                        id: user.id,
                        name: user.name,
                    }))
                );
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
            setLoadingUsers(false);
        };
        fetchAllUsers();
    }, []);

    const handleFinish = async (values: any) => {
        try {
            const response = await axios.post(
                'https://gorest.co.in/public/v2/posts',
                {
                    user_id: values.userId,
                    title: values.title,
                    body: values.description,
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
                setModalContent('Post created successfully!');
                setModalStatus('success');
                setModalOpen(true);
                form.resetFields();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create post';
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
                                    Create Post
                                </span>
                            ),
                        },
                    ]}
                />

                <div style={{ marginTop: 24, background: '#fff', borderRadius: 8 }}>
                    < span style={{
                        fontSize: '20px',
                        fontWeight: '400',
                        marginBottom: '8px',
                        display: 'inline-block',
                    }}
                    >
                        Create Post
                    </span>
                    <Divider style={{ margin: '2px 0 12px 0', borderWidth: '1px', borderColor: '#000000' }} />
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        onFinishFailed={handleFinishFailed}
                        requiredMark={false}
                    >

                        <Form.Item
                            label={
                                <span style={{fontSize:'14px', fontWeight:'600' }}>
                                    User<span style={{ color: 'red'}}> *</span>
                                </span>
                            }
                            name="userId"
                            rules={[{ required: true, message: 'User is required. Please pick your user.' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select user"
                                loading={loadingUsers}
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                style={{ width: '100%' }}
                            >
                                {users.map((user) => (
                                    <Option key={user.id} value={user.id}>
                                        {user.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={
                                <span style={{fontSize:'14px', fontWeight:'600' }}>
                                    Title<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="title"
                            rules={[{ required: true, message: 'Title is required. Please input the title.' }]}
                        >
                            <Input placeholder="Please fill post title..." />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span style={{fontSize:'14px', fontWeight:'600' }}>
                                    Description<span style={{ color: 'red' }}> *</span>
                                </span>
                            }
                            name="description"
                            rules={[{ required: true, message: 'Description is required. Please input the description.' }]}
                        >
                            <TextArea rows={6} placeholder="Please fill post description..." />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ backgroundColor: '#5cc8be', borderColor: '#5cc8be', alignItems: 'center', marginTop: '2em' }}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <Modal
                    title={modalTitle}
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={[
                        <Button
                            key="ok"
                            type="primary"
                            onClick={() => setModalOpen(false)}
                            style={{
                                backgroundColor: '#5cc8be',
                                borderColor: '#5cc8be',
                                margin: '0 auto',
                                display: 'block',
                            }}
                        >
                            OK
                        </Button>,
                    ]}
                    centered
                    bodyStyle={{ textAlign: 'center' }}
                    modalRender={(node) => (
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
            </div >
        </CustomSider >
    );
};

export default CreatePost;