import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Tooltip } from "antd";
import { faUser, faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";

const { Header, Content } = Layout;

const SIDEBAR_WIDTH = 200;
const SIDEBAR_COLLAPSED_WIDTH = 80;

const profileMenu = [
  { key: "logout", label: "Logout" },
];

const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  // Load user dari localStorage/sessionStorage saat mount
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);

    }
  }, []);

//Logout handle
  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "logout") {
      sessionStorage.removeItem("user");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: "0 2px 8px #f0f1f2",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo-main.png" alt="BloX Logo" style={{ height: 40 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div>
            <div style={{ fontWeight: "bold" }}>{user?.name || "Guest"}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>{user?.email || "No Email"}</div>
          </div>
          <Dropdown
            menu={{ items: profileMenu, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
            disabled={!user}
          >
            <Avatar
              style={{ cursor: user ? "pointer" : "default" }}
              size="large"
              icon={<FontAwesomeIcon icon={faUser} />}
            />
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sidebar collapsed={collapsed} onMenuClick={(menuItem) => router.push(menuItem.key)} />

        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: "fixed",
              top: 80,
              left: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH - 4,
              zIndex: 1100,
              width: 18,
              height: 18,
              color: "#DBDBDB",
              backgroundColor: "#787878",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "left 0.3s, background-color 0.3s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              userSelect: "none",
            }}
          >
            <FontAwesomeIcon
              icon={collapsed ? faCircleChevronRight : faCircleChevronLeft}
              style={{ fontSize: 20 }}
            />
          </div>
        </Tooltip>

        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            backgroundColor: "#fff",
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>

      <style jsx global>{`
        .custom-menu .ant-menu-item,
        .custom-menu .ant-menu-submenu-title {
          color: #888888;
          font-weight: 500;
          transition: background-color 0.3s, color 0.3s;
        }
        .custom-menu .ant-menu-item:hover,
        .custom-menu .ant-menu-submenu-title:hover {
          background-color: rgba(89, 161, 165, 0.1) !important;
          color: #59A1A5 !important;
        }
        .custom-menu .ant-menu-item-selected {
          color: #59A1A5 !important;
          font-weight: 600;
        }
      `}</style>
    </Layout>
  );
};

export default CustomLayout;