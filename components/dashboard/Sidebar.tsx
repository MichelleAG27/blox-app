import React from 'react';
import { Menu, Layout } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { DashboardFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComment } from '@fortawesome/free-solid-svg-icons';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <span style={{ fontWeight: '600', fontSize: 14 }}>Dashboard</span>,
    'group1',
    undefined,
    [getItem('Dashboard', '/dashboard', <DashboardFilled />),
    { type: 'divider', key: 'divider1' }],
    'group',
  ),
  getItem(
    <span style={{ fontWeight: '600', fontSize: 14 }}>Blog Management</span>,
    'group2',
    undefined,
    [
      getItem('Create User', '/create-user', <FontAwesomeIcon icon={faUser} />),
      getItem('Create Post', '/create-post', <FontAwesomeIcon icon={faComment} />),
      { type: 'divider', key: 'divider2' },
    ],
    'group',
  ),
];

interface SidebarProps {
  collapsed: boolean;
  onMenuClick: (menuItem: { key: string }) => void;
}

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 80;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onMenuClick }) => {
  const router = useRouter();

  return (
    <Sider
      collapsed={collapsed}
      collapsible={false}
      trigger={null}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      style={{
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflow: 'auto',
        background: '#F9F9F9',
        transition: 'width 0.3s',
      }}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={[router.pathname]}
        mode="inline"
        items={items}
        onClick={onMenuClick}
        className="custom-menu"
      />
    </Sider>
  );
};

export default Sidebar;