import CustomSider from "@/components/dashboard/CustomSidebar";
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, Col, Row, Breadcrumb } from "antd";
import { fetchUsers, fetchPosts } from "@/services/dashboardService";
import DashboardTable from "@/components/dashboard/DashboardTable";
import dynamic from 'next/dynamic';
const DashboardFilled = dynamic(() => import('@ant-design/icons/DashboardFilled'), { ssr: false });


const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [postTotal, setPostTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers();
        const postsResponse = await fetchPosts();

        setUsers(usersResponse.data);      // hanya halaman 1
        setUserTotal(usersResponse.total); // total user dari API header

        setPosts(postsResponse.data);      // hanya halaman 1
        setPostTotal(postsResponse.total); // total post dari API header
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // totalUsers = userTotal (total data semua users)
  // totalPosts = postTotal (total data semua posts)

  // userStatusCounts dan genderCounts masih hitung dari users (halaman 1)

  // Calculate stats
  const totalUsers = userTotal;
  const totalPosts = postTotal;

  const userStatusCounts = users.reduce(
    (acc, user) => {
      if (user.status === "active") acc.active++;
      else acc.inactive++;
      return acc;
    },
    { active: 0, inactive: 0 }
  );

  const genderCounts = users.reduce(
    (acc, user) => {
      if (user.gender === "male") acc.male++;
      else if (user.gender === "female") acc.female++;
      return acc;
    },
    { male: 0, female: 0 }
  );

  const blogPostData = users.map((user) => ({
    name: user.name,
    posts: posts.filter((post) => post.user_id === user.id).length,
  }));

  // ECharts options
  const blogPostOptions = {
    grid: {
      bottom: 80,
      left: 50,
      right: 30,
      top: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: blogPostData.map((data) => data.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        padding: 10,
        fontSize: 8,
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Jumlah Post",
        data: blogPostData.map((data) => ({
          value: data.posts,
          name: data.name,
        })),
        type: "bar",
        color: "#5CC8BE",
        label: {
          show: false,
        },
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

  const userStatusOptions = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: [
          { value: userStatusCounts.active, name: "Active" },
          { value: userStatusCounts.inactive, name: "Inactive" },
        ],
        color: ["#0088FE", "#FF8042"],
      },
    ],
  };

  const genderOptions = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: [
          { value: genderCounts.male, name: "Male" },
          { value: genderCounts.female, name: "Female" },
        ],
        color: ["#8884d8", "#82ca9d"],
      },
    ],
  };

  return (
    <CustomSider>
      <div className="p-4">
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
            fontFamily: "Sora, sans-serif",
            color: "#000000",
            marginBottom: "8px",
            display: "inline-block",
          }}
        >
          Dashboard
        </span>
        <Breadcrumb
          style={{ marginBottom: "16px" }}
          items={[
            {
              href: '',
              title: (
                <>
                  <DashboardFilled style={{ color: '#59A1A5', fontSize: 16 }} />
                  <span style={{ fontWeight: '400', marginLeft: 8, color: '#59A1A5' }}>Dashboard</span>
                </>
              ),
            },
          ]}
        />

        {/* Summary Stats */}
        <Row gutter={[16, 16]} className="pb-12 mb-4">
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ marginBottom: 16 }}
              title={
                <span style={{ fontSize: "14px", color: "#888" }}>
                  Total Users
                </span>
              }
              headStyle={{ padding: "12px 12px", borderBottom: "none" }}
              bodyStyle={{
                padding: "0 12px",
                height: "60px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: "0",
                }}
              >
                {totalUsers}
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ marginBottom: 16 }}
              title={
                <span style={{ fontSize: "14px", color: "#888" }}>
                  Total Posts
                </span>
              }
              headStyle={{ padding: "12px 12px", borderBottom: "none" }}
              bodyStyle={{
                padding: "0 12px",
                height: "60px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: "0",
                }}
              >
                {totalPosts}
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ marginBottom: 16 }}
              title={
                <span style={{ fontSize: "14px", color: "#888" }}>
                  User Status (active/non)
                </span>
              }
              headStyle={{ padding: "12px 12px", borderBottom: "none" }}
              bodyStyle={{
                padding: "0 12px",
                height: "60px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: "0",
                }}
              >
                {userStatusCounts.active}/{userStatusCounts.inactive}
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card
              style={{ marginBottom: 16 }}
              title={
                <span style={{ fontSize: "14px", color: "#888" }}>
                  User Gender (m/f)
                </span>
              }
              headStyle={{ padding: "12px 12px", borderBottom: "none" }}
              bodyStyle={{
                padding: "0 12px",
                height: "60px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: "0",
                }}
              >
                {genderCounts.male}/{genderCounts.female}
              </p>
            </Card>
          </Col>
        </Row>

        <div
          style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
        >
          {/* Bar Chart */}
          <div style={{ flex: 1 }}>
            <Card
              title="Blog Post Quantity"
              headStyle={{ borderBottom: "none" }}
              bodyStyle={{ padding: 12, minHeight: 500 }}
            >
              <ReactECharts
                option={blogPostOptions}
                style={{ height: 500, minWidth: 450, width: "100%" }}
              />
            </Card>
          </div>

          {/* Ring Gauge Charts */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Card title="User Status" headStyle={{ borderBottom: "none" }}>
              <ReactECharts
                option={{
                  series: [
                    {
                      type: "gauge",
                      startAngle: 90,
                      endAngle: -270,
                      progress: { show: true, width: 10 },
                      axisLine: {
                        lineStyle: {
                          width: 10,
                          color: [
                            [0.5, "#FF8042"],
                            [1, "#0088FE"],
                          ],
                        },
                      },
                      pointer: { show: false },
                      detail: {
                        valueAnimation: true,
                        formatter: "{value}%",
                        fontSize: 16,
                      },
                      data: [
                        {
                          value: Number(
                            ((userStatusCounts.active / totalUsers) * 100).toFixed(
                              2
                            )
                          ),
                          name: "Active",
                        },
                      ],
                    },
                  ],
                }}
                style={{ height: 180 }}
              />
            </Card>

            <Card title="User Gender" headStyle={{ borderBottom: "none" }}>
              <ReactECharts
                option={{
                  series: [
                    {
                      type: "gauge",
                      startAngle: 90,
                      endAngle: -270,
                      progress: { show: true, width: 10 },
                      axisLine: {
                        lineStyle: {
                          width: 10,
                          color: [
                            [0.5, "#82ca9d"],
                            [1, "#8884d8"],
                          ],
                        },
                      },
                      pointer: { show: false },
                      detail: {
                        valueAnimation: true,
                        formatter: "{value}%",
                        fontSize: 16,
                      },
                      data: [
                        {
                          value: Number(
                            ((genderCounts.male / totalUsers) * 100).toFixed(2)
                          ),
                          name: "Male",
                        },
                      ],
                    },
                  ],
                }}
                style={{ height: 180 }}
              />
            </Card>
          </div>


        </div>
        <div>
          <DashboardTable />
        </div>
      </div>
    </CustomSider>

  );
};

export default Dashboard;