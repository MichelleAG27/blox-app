import React, { useEffect, useState } from "react";
import CustomSider from "@/components/dashboard/CustomSidebar";
import { Breadcrumb } from "antd";
import dynamic from 'next/dynamic';
import { fetchUsers, fetchPosts } from "@/services/dashboardService";
import SummaryStats from "@/components/dashboard/SummaryStat";
import ChartsPanel from "@/components/dashboard/ChartPanel";
import DashboardTable from "@/components/dashboard/DashboardTable";


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

        setUsers(usersResponse.data);
        setUserTotal(usersResponse.total);

        setPosts(postsResponse.data);
        setPostTotal(postsResponse.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        <SummaryStats users={users} totalUsers={userTotal} totalPosts={postTotal} />
        <ChartsPanel users={users} totalUsers={userTotal} posts={posts}/>
        <DashboardTable />
      </div>
    </CustomSider>
  );
};

export default Dashboard;