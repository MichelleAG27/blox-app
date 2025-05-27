import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

interface Props {
    users: any[];
    totalUsers: number;
}

const UserGenderDoughnut: React.FC<Props> = ({ users, totalUsers }) => {
    const maleUsers = users.filter(user => user.gender==="male").length;
    const femaleUsers = totalUsers - maleUsers;
    console.log(maleUsers);
    console.log(femaleUsers);
    const data = [
        {
            value: maleUsers,
            name: "Male",
            itemStyle: { color: "#7851A9", borderWidth: 2, borderColor: "#fff" },
        },
        {
            value: femaleUsers,
            name: "Female",
            itemStyle: { color: "#4682B4", borderWidth: 2, borderColor: "#fff" },
        },
    ];

    const option = {
        tooltip: { show: true, formatter: "{b}: {c}" },
        legend: {
            bottom: "5%",
            left: "center",
            formatter: (name: string) => {
                const item = data.find((d) => d.name === name);
                return `${name} (${item?.value || 0})`;
            },
            textStyle: { fontSize: 12 },
        },
        series: [
            {
                name: "Users by Gender",
                type: "pie",
                radius: ["40%", "70%"],
                center: ["50%", "45%"],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: "center",
                    formatter: () => `{a|Total}\n{b|${totalUsers}}`,
                    rich: {
                        a: {
                            fontSize: 12,
                            fontWeight: "normal",
                            color: "#666",
                        },
                        b: {
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#666",
                        },
                    },
                },
                emphasis: { disabled: true },
                labelLine: { show: false },
                itemStyle: { borderWidth: 2, borderColor: "#fff" },
                data,
            },
        ],
    };

    return (
        <Card
            title="User Gender"
            headStyle={{ borderBottom: "none", paddingBottom: 2 }}
            style={{ width: 350, height: 300, padding: 0 }}
            bodyStyle={{ height: "calc(100% - 48px)", padding: 0 }}
        >
            <ReactECharts option={option} style={{ height: "80%", width: "100%" }} />
        </Card>
    );
};

export default UserGenderDoughnut;