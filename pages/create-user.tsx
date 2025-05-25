import CustomSider from '@/components/dashboard/CustomSidebar';
import { Breadcrumb } from 'antd';
import dynamic from 'next/dynamic';
const DashboardFilled = dynamic(() => import('@ant-design/icons/DashboardFilled'), { ssr: false });


const CreateUser = () => {
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
                    Blog Management
                </span>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: (
                                <>
                                    <DashboardFilled />
                                    <span>Dashboard</span>
                                </>
                            ),
                        },
                        {
                            title: (
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                                    Create User
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
        </CustomSider>
    );
};

export default CreateUser;