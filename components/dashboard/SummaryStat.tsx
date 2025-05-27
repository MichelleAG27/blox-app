import React from "react";
import { Row, Col, Card } from "antd";

interface Props {
  users: any[];
  totalUsers: number;
  totalPosts: number;
}

const SummaryStats: React.FC<Props> = ({ users, totalUsers, totalPosts }) => {
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

  return (
    <Row gutter={[16, 16]} className="pb-12 mb-4">
      <Col xs={24} sm={12} md={6}>
        <Card title={<span style={{ fontSize: "14px", color: "#888" }}>Total Users</span>} headStyle={{ padding: "12px 12px", borderBottom: "none" }} bodyStyle={{ padding: "0 12px", height: "60px", display: "flex", alignItems: "flex-start" }}>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#000", margin: 0 }}>{totalUsers}</p>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card title={<span style={{ fontSize: "14px", color: "#888" }}>Total Posts</span>} headStyle={{ padding: "12px 12px", borderBottom: "none" }} bodyStyle={{ padding: "0 12px", height: "60px", display: "flex", alignItems: "flex-start" }}>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#000", margin: 0 }}>{totalPosts}</p>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card title={<span style={{ fontSize: "14px", color: "#888" }}>User Status (active/non)</span>} headStyle={{ padding: "12px 12px", borderBottom: "none" }} bodyStyle={{ padding: "0 12px", height: "60px", display: "flex", alignItems: "flex-start" }}>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#000", margin: 0 }}>{userStatusCounts.active}/{userStatusCounts.inactive}</p>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card title={<span style={{ fontSize: "14px", color: "#888" }}>User Gender (m/f)</span>} headStyle={{ padding: "12px 12px", borderBottom: "none" }} bodyStyle={{ padding: "0 12px", height: "60px", display: "flex", alignItems: "flex-start" }}>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#000", margin: 0 }}>{genderCounts.male}/{genderCounts.female}</p>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryStats;