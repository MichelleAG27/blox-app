import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface DataItem {
  name: string;
  posts: number;
}

const BlogPostChart: React.FC<{ data: DataItem[] }> = ({ data }) => {
  const options = {
    grid: {
      bottom: 80,
      left: 50,
      right: 30,
      top: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        padding: 10,
        fontSize: 10,
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Jumlah Post",
        data: data.map((item) => ({
          value: item.posts,
          name: item.name,
        })),
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
    legend: {
      data: ["Jumlah Post"],
      bottom: 0,
      left: 0,
    },
  };

  return (
    <Card
      title="Blog Post Quantity"
      style={{ width: "100%", margin: "20px auto" }}
      bodyStyle={{ padding: 16, minHeight: 520 }}
    >
      <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
    </Card>
  );
};

export default BlogPostChart;