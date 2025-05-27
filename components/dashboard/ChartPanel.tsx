import React, { useState, useEffect } from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import UserStatusGauge from "./UserStatusChart";
import UserGenderGauge from "./UserGenderChart";

interface Props {
  users: any[];
  posts: any[];
  totalUsers: number;
}

const ChartsPanel: React.FC<Props> = ({ users, posts, totalUsers }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const blogPostData = users.map((user) => ({
    name: user.name,
    posts: posts.filter((post) => post.user_id === user.id).length,
  }));

  const blogPostOptions = {
    grid: { bottom: 80, left: 50, right: 30, top: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: blogPostData.map((data) => data.name),
      axisLabel: { interval: 0, rotate: isMobile ? 60 : 45, padding: 10, fontSize: isMobile ? 6 : 8 },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Jumlah Post",
        data: blogPostData.map((data) => ({ value: data.posts, name: data.name })),
        type: "bar",
        color: "#5CC8BE",
        label: { show: false },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any[]) => {
        const { name, value } = params[0];
        return `${name}: ${value} Posts`;
      },
    },
    legend: { data: ["Jumlah Post"], bottom: 0, left: 0 },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 16,
        alignItems: "flex-start",
        marginTop: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: isMobile ? "100%" : 500 }}>
        <Card title="Blog Post Quantity" headStyle={{ borderBottom: "none" }} bodyStyle={{ padding: 12, minHeight: 500 }}>
          <ReactECharts option={blogPostOptions} style={{ height: 500, width: "90%" }} />
        </Card>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: isMobile ? "100%" : undefined }}>
        <UserStatusGauge users={users} totalUsers={totalUsers} />
        <UserGenderGauge users={users} totalUsers={totalUsers} />
      </div>
    </div>
  );
};

export default ChartsPanel;
