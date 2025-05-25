import React, { useEffect, useState } from "react";
import { Table, Input, Button, Menu, Modal, Form, Popconfirm, message, Row, Col, Select, Tabs, Badge, Dropdown } from "antd";
import { EllipsisOutlined } from '@ant-design/icons';
import type { TablePaginationConfig, SorterResult } from "antd/es/table/interface";
import axios from "axios";

const API_URL = "https://gorest.co.in/public/v2";
const TOKEN = "8af7ee5d85481fde941984822384dc207556ab823cda124759b2919cce92a413";

interface User {
    id: number;
    name: string;
    email: string;
    gender?: string;
    status?: string;
}

interface Post {
    id: number;
    user_id: number;
    title: string;
    body?: string;
}

const DashboardTable: React.FC = () => {
    // --- Users state ---
    const [users, setUsers] = useState<User[]>([]);
    const [usersPagination, setUsersPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [usersLoading, setUsersLoading] = useState(false);

    const [activeTable, setActiveTable] = useState<"users" | "posts">("users");
    const { TabPane } = Tabs;


    // Users filter & search states
    const [userFilterField, setUserFilterField] = useState<"name" | "email">("name");
    const [userFilterValue, setUserFilterValue] = useState("");
    const [userSearchValue, setUserSearchValue] = useState("");

    // --- Posts state ---
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsPagination, setPostsPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [postsLoading, setPostsLoading] = useState(false);

    // Posts filter & search states
    const [postFilterField, setPostFilterField] = useState<"title" | "body">("title");
    const [postFilterValue, setPostFilterValue] = useState("");
    const [postSearchValue, setPostSearchValue] = useState("");

    // Editing
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    // --- Fetch Users ---
    const fetchUsers = async (
        pagination = usersPagination,
        filterField = userFilterField,
        filterValue = userFilterValue,
        searchValue = userSearchValue,
        sorter: SorterResult<User> | SorterResult<User>[] = {}
    ) => {
        setUsersLoading(true);
        try {
            const params: any = {
                page: pagination.current,
                per_page: pagination.pageSize,
            };

            if (filterValue.trim() !== "") {
                params[filterField] = filterValue.trim();
            }

            // Hapus bagian ini karena API tidak support:
            // if (!Array.isArray(sorter) && sorter.field) {
            //   params.sort = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
            // }

            const { data, headers } = await axios.get<User[]>(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
                params,
            });

            // Filter search global secara lokal
            let filteredData = data;
            if (searchValue.trim() !== "") {
                const s = searchValue.toLowerCase();
                filteredData = data.filter(
                    (u) =>
                        u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
                );
            }

            // Sorting secara lokal
            if (!Array.isArray(sorter) && sorter.field && sorter.order) {
                filteredData.sort((a, b) => {
                    const field = sorter.field as keyof User;
                    let valA = a[field];
                    let valB = b[field];

                    // Jika null/undefined, set ke string kosong agar tidak error
                    valA = valA ?? "";
                    valB = valB ?? "";

                    if (typeof valA === "string") valA = valA.toLowerCase();
                    if (typeof valB === "string") valB = valB.toLowerCase();

                    if (valA > valB) return sorter.order === "ascend" ? 1 : -1;
                    if (valA < valB) return sorter.order === "ascend" ? -1 : 1;
                    return 0;
                });
            }

            setUsers(filteredData);
            setUsersPagination({
                ...pagination,
                total: parseInt(headers["x-pagination-total"]) || filteredData.length,
            });
        } catch (error) {
            message.error("Failed to load users");
        } finally {
            setUsersLoading(false);
        }
    };


    // --- Fetch Posts ---
    const fetchPosts = async (
        pagination = postsPagination,
        filterField = postFilterField,
        filterValue = postFilterValue,
        searchValue = postSearchValue,
        sorter: SorterResult<Post> | SorterResult<Post>[] = {}
    ) => {
        setPostsLoading(true);
        try {
            const params: any = {
                page: pagination.current,
                per_page: pagination.pageSize,
            };

            if (filterValue.trim() !== "") {
                params[filterField] = filterValue.trim();
            }

            // Hapus sorting param dari API
            // if (!Array.isArray(sorter) && sorter.field) {
            //   params.sort = sorter.order === "ascend" ? sorter.field : `-${sorter.field}`;
            // }

            const { data, headers } = await axios.get<Post[]>(`${API_URL}/posts`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
                params,
            });

            // Filter search global lokal
            let filteredData = data;
            if (searchValue.trim() !== "") {
                const s = searchValue.toLowerCase();
                filteredData = data.filter(
                    (p) =>
                        p.title.toLowerCase().includes(s) ||
                        (p.body?.toLowerCase().includes(s) ?? false)
                );
            }

            // Sorting lokal
            if (!Array.isArray(sorter) && sorter.field && sorter.order) {
                filteredData.sort((a, b) => {
                    const field = sorter.field as keyof Post;
                    let valA = a[field];
                    let valB = b[field];

                    valA = valA ?? "";
                    valB = valB ?? "";

                    if (typeof valA === "string") valA = valA.toLowerCase();
                    if (typeof valB === "string") valB = valB.toLowerCase();

                    if (valA > valB) return sorter.order === "ascend" ? 1 : -1;
                    if (valA < valB) return sorter.order === "ascend" ? -1 : 1;
                    return 0;
                });
            }

            setPosts(filteredData);
            setPostsPagination({
                ...pagination,
                total: parseInt(headers["x-pagination-total"]) || filteredData.length,
            });
        } catch (error) {
            message.error("Failed to load posts");
        } finally {
            setPostsLoading(false);
        }
    };


    // --- On mount ---
    useEffect(() => {
        fetchUsers();
        fetchPosts();
    }, []);

    // --- Table change handlers ---
    const handleUsersTableChange = (
        pagination: TablePaginationConfig,
        _filters: any,
        sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
        fetchUsers(pagination, userFilterField, userFilterValue, userSearchValue, sorter);
    };

    const handlePostsTableChange = (
        pagination: TablePaginationConfig,
        _filters: any,
        sorter: SorterResult<Post> | SorterResult<Post>[]
    ) => {
        fetchPosts(pagination, postFilterField, postFilterValue, postSearchValue, sorter);
    };

    // --- Filter & search handlers for Users ---
    const onUserFilterFieldChange = (value: "name" | "email") => {
        setUserFilterField(value);
    };

    const onUserFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFilterValue(e.target.value);
    };

    const onUserSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSearchValue(e.target.value);
    };

    const applyUserFilter = () => {
        fetchUsers({ ...usersPagination, current: 1 }, userFilterField, userFilterValue, userSearchValue);
    };

    // --- Filter & search handlers for Posts ---
    const onPostFilterFieldChange = (value: "title" | "body") => {
        setPostFilterField(value);
    };

    const onPostFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostFilterValue(e.target.value);
    };

    const onPostSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostSearchValue(e.target.value);
    };

    const applyPostFilter = () => {
        fetchPosts({ ...postsPagination, current: 1 }, postFilterField, postFilterValue, postSearchValue);
    };

    // --- Modal & CRUD ---
    const openEditModal = (record: User | Post, type: "user" | "post") => {
        setModalVisible(true);
        if (type === "user") {
            setEditingUser(record as User);
            setEditingPost(null);
            form.setFieldsValue(record);
        } else {
            setEditingPost(record as Post);
            setEditingUser(null);
            form.setFieldsValue(record);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingUser(null);
        setEditingPost(null);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            if (editingUser) {
                await axios.put(`${API_URL}/users/${editingUser.id}`, values, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });
                message.success("User updated");
                fetchUsers();
            } else if (editingPost) {
                await axios.put(`${API_URL}/posts/${editingPost.id}`, values, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });
                message.success("Post updated");
                fetchPosts();
            }
            closeModal();
        } catch {
            message.error("Update failed");
        }
    };

    const onDelete = async (id: number, type: "users" | "posts") => {
        try {
            await axios.delete(`${API_URL}/${type}/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            message.success(`${type === "users" ? "User" : "Post"} deleted`);
            if (type === "users") fetchUsers();
            else fetchPosts();
        } catch {
            message.error("Delete failed");
        }
    };

    // --- Columns ---
    const userColumns = [
    { title: "ID", dataIndex: "id", sorter: true },
    { title: "Name", dataIndex: "name", sorter: true },
    { title: "Email", dataIndex: "email", sorter: true },
    { title: "Gender", dataIndex: "gender", sorter: true },
    { title: "Status", dataIndex: "status", sorter: true },
    {
        title: "Actions",
        render: (_: any, record: User) => {
            const menu = (
                <Menu>
                    <Menu.Item key="edit" onClick={() => openEditModal(record, "user")}>
                        Edit
                    </Menu.Item>
                    <Menu.Item key="delete">
                        <Popconfirm
                            title="Delete user?"
                            onConfirm={() => onDelete(record.id, "users")}
                            okText="Yes"
                            cancelText="No"
                        >
                            <span style={{ color: 'red' }}>Delete</span>
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            );
            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            );
        }
    },
];

    const postColumns = [
    { title: "ID", dataIndex: "id", sorter: true },
    { title: "User ID", dataIndex: "user_id", sorter: true },
    { title: "Title", dataIndex: "title", sorter: true },
    { title: "Body", dataIndex: "body" },
    {
        title: "Actions",
        render: (_: any, record: Post) => {
            const menu = (
                <Menu>
                    <Menu.Item key="edit" onClick={() => openEditModal(record, "post")}>
                        Edit
                    </Menu.Item>
                    <Menu.Item key="delete">
                        <Popconfirm
                            title="Delete post?"
                            onConfirm={() => onDelete(record.id, "posts")}
                            okText="Yes"
                            cancelText="No"
                        >
                            <span style={{ color: 'red' }}>Delete</span>
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            );
            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<EllipsisOutlined />} />
                </Dropdown>
            );
        }
    },
];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
                <Tabs
                    activeKey={activeTable}
                    onChange={(key) => setActiveTable(key as "users" | "posts")}
                    tabBarStyle={{ color: '#5CC8BE' }}
                    style={{ '--antd-tabs-ink-bar-color': '#5CC8BE' } as React.CSSProperties}
                >
                    <TabPane
                        tab={
                            <span>
                                User <Badge count={users.length} style={{ backgroundColor: '#5CC8BE' }} />
                            </span>
                        }
                        key="users"
                    />
                    <TabPane
                        tab={
                            <span>
                                Post <Badge count={posts.length} style={{ backgroundColor: '#5CC8BE' }} />
                            </span>
                        }
                        key="posts"
                    />
                </Tabs>
            </div>

            {/* --- Users Section --- */}
            {activeTable === "users" && (
                <>
                    <h2>Users</h2>
                    <Row gutter={8} style={{ marginBottom: 16 }}>
                        <Col>
                            <Select
                                value={userFilterField}
                                onChange={onUserFilterFieldChange}
                                style={{ width: 120 }}
                            >
                                <Select.Option value="name">Name</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                            </Select>
                        </Col>
                        <Col>
                            <Input
                                placeholder="Filter value"
                                value={userFilterValue}
                                onChange={onUserFilterValueChange}
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Button
                                onClick={applyUserFilter}
                                type="primary"
                                style={{ backgroundColor: '#5CC8BE', borderColor: '#5CC8BE', color: 'white' }}
                            >
                                Apply Filter
                            </Button>
                        </Col>
                        <Col flex="auto" />
                        <Col>
                            <Input.Search
                                placeholder="Search users"
                                value={userSearchValue}
                                onChange={onUserSearchValueChange}
                                onSearch={() =>
                                    fetchUsers(
                                        { ...usersPagination, current: 1 },
                                        userFilterField,
                                        userFilterValue,
                                        userSearchValue
                                    )
                                }
                                allowClear
                                enterButton={
                                    <Button style={{ backgroundColor: '#5CC8BE', borderColor: '#5CC8BE', color: 'white' }}>
                                        Search
                                    </Button>
                                }
                                style={{ borderColor: '#5CC8BE' }}
                            />

                        </Col>
                    </Row>

                    <Table
                        columns={userColumns}
                        dataSource={users}
                        rowKey="id"
                        pagination={usersPagination}
                        loading={usersLoading}
                        onChange={handleUsersTableChange}
                    />
                </>
            )}

            {/* --- Posts Section --- */}
            {activeTable === "posts" && (
                <>
                    <h2>Posts</h2>
                    <Row gutter={8} style={{ marginBottom: 16 }}>
                        <Col>
                            <Select
                                value={postFilterField}
                                onChange={onPostFilterFieldChange}
                                style={{ width: 120 }}
                            >
                                <Select.Option value="title">Title</Select.Option>
                                <Select.Option value="body">Body</Select.Option>
                            </Select>
                        </Col>
                        <Col>
                            <Input
                                placeholder="Filter value"
                                value={postFilterValue}
                                onChange={onPostFilterValueChange}
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Button
                                onClick={applyUserFilter}
                                type="primary"
                                style={{ backgroundColor: '#5CC8BE', borderColor: '#5CC8BE', color: 'white' }}
                            >
                                Apply Filter
                            </Button>
                        </Col>
                        <Col flex="auto" />
                        <Col>
                            <Input.Search
                                placeholder="Search posts"
                                value={postSearchValue}
                                onChange={onPostSearchValueChange}
                                onSearch={() =>
                                    fetchPosts(
                                        { ...postsPagination, current: 1 },
                                        postFilterField,
                                        postFilterValue,
                                        postSearchValue
                                    )
                                }
                                allowClear
                                enterButton={
                                    <Button style={{ backgroundColor: '#5CC8BE', borderColor: '#5CC8BE', color: 'white' }}>
                                        Search
                                    </Button>
                                }
                                style={{ borderColor: '#5CC8BE' }}
                            />
                        </Col>
                    </Row>

                    <Table
                        columns={postColumns}
                        dataSource={posts}
                        rowKey="id"
                        pagination={postsPagination}
                        loading={postsLoading}
                        onChange={handlePostsTableChange}
                    />
                </>
            )}

            {/* --- Edit Modal --- */}
            <Modal
                title={editingUser ? "Edit User" : "Edit Post"}
                visible={modalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    {editingUser && (
                        <>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: "Please input name" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, type: "email", message: "Please input valid email" },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="gender" label="Gender">
                                <Select>
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="status" label="Status">
                                <Select>
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    {editingPost && (
                        <>
                            <Form.Item
                                name="user_id"
                                label="User ID"
                                rules={[{ required: true, message: "Please input user id" }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: "Please input title" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="body" label="Body">
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );

};

export default DashboardTable;