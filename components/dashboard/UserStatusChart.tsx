import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface Props {
  users: any[]; 
  totalUsers: number;
}

const UsserStatusChart: React.FC<Props> = ({ users, totalUsers }) => {
  const activeUsers = users.filter(user => user.status === "active").length;
  const inactiveUsers = totalUsers - activeUsers;

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: "5%",
      bottom: "5%",
      textStyle: { fontSize: 12 },
    },
    graphic: {
      elements: [
        {
          type: "text",
          right: 40,      
          bottom: 120,   
          style: {
            text: `${activeUsers} / ${inactiveUsers}`,
            fill: "#000",
            font: "bold 20px Arial",
          },
        },
      ],
    },
    series: [
      {
        name: "Inactive Users",
        type: "pie",
        radius: ["30%", "45%"],
        center: ["40%", "50%"], 
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        labelLine: { show: false },
        data: [
          {
            value: inactiveUsers,
            name: "Inactive",
            itemStyle: { color: "#F44336" },
          },
        ],
      },
      {
        name: "Active Users",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["40%", "50%"], 
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        labelLine: { show: false },
        data: [
          {
            value: activeUsers,
            name: "Active",
            itemStyle: { color: "#4CAF50" },
          },
        ],
      },
    ],
  };

  return (
    <Card
      title="User Status"
      headStyle={{ borderBottom: "none", paddingBottom: 2 }}
      style={{ width: 350, height: 300, padding: 0 }}
      bodyStyle={{ height: "calc(100% - 48px)", padding: 0 }}
    >
      <ReactECharts option={option} style={{ height: "80%", width: "100%" }} />
    </Card>
  );
};

export default UsserStatusChart;