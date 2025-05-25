import React from 'react';
import { Layout } from 'antd';
import CustomSider from '@/components/dashboard/CustomSidebar';

const { Header, Content, Footer } = Layout;

const Dashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CustomSider />
      <Layout
        style={{
          padding: '24px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Content
          style={{
            margin: 0,
            minHeight: 280,
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 24,
          }}
        >
          <h1>Welcome to BloX Dashboard</h1>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
