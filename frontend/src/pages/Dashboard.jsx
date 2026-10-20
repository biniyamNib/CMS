import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  UserOutlined,
  ScheduleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Progress,
  Layout,
  Alert,
  Spin,
  Calendar,
} from "antd";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import {
  fetchDashboardStats,
  fetchRecentActivities,
  fetchCompanyRegistrations,
  fetchLicenseDistribution,
} from "../slices/dashboardSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const { Title, Text } = Typography;
const { Content } = Layout;

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    stats,
    activities,
    companyRegistrations,
    licenseDistribution,
    loading,
    error,
  } = useSelector((state) => state.dashboard);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivities());
    dispatch(fetchCompanyRegistrations());
    dispatch(fetchLicenseDistribution());
  }, [dispatch]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Registrations" },
      },
      x: {
        title: { display: true, text: "Month" },
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  const licenseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "right" },
      title: { display: true, text: "License Status Distribution" },
    },
  };

  const licenseChartData = {
    labels: licenseDistribution.labels || ["Active", "Expired", "Suspended"],
    datasets: [
      {
        data: licenseDistribution.data || [0, 0, 0],
        backgroundColor: ["#52c41a", "#f5222d", "#fa8c16"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const iconMap = {
    "Total Companies": <BankOutlined className="text-2xl" />,
    "Active Users": <UserOutlined className="text-2xl" />,
    "Total Shareholders": <TeamOutlined className="text-2xl" />,
    "Pending Licenses": <ScheduleOutlined className="text-2xl" />,
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Navbar />
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          className={`p-6 transition-all duration-300 ${
            collapsed ? "ml-24" : "ml-64"
          } mt-20 max-w-screen-2xl mx-auto`}
        >
          <Space direction="vertical" size="large" className="w-full">
            <div className="mb-6">
              <Title level={2} className="text-gray-800 font-semibold">
                Dashboard Overview
              </Title>
              <Text className="text-gray-500">
                Your centralized hub for managing companies, users, and
                operations
              </Text>
            </div>

            {loading && <Spin size="large" className="flex justify-center" />}
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="mb-6 rounded-lg"
              />
            )}

            {!loading && !error && (
              <>
                <Row gutter={[16, 16]}>
                  {stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                      <Card
                        className="shadow-md hover:shadow-lg transition-shadow rounded-lg border-0"
                        style={{ borderLeft: `4px solid ${stat.color}` }}
                      >
                        <Space
                          direction="vertical"
                          size="middle"
                          className="w-full"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <Text className="text-gray-500">
                                {stat.title}
                              </Text>
                              <Title level={3} className="text-gray-800 my-2">
                                {stat.value}
                              </Title>
                              <Text
                                className={
                                  stat.trend === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {stat.trend === "up" ? (
                                  <ArrowUpOutlined className="mr-1" />
                                ) : (
                                  <ArrowDownOutlined className="mr-1" />
                                )}
                                {stat.change}
                              </Text>
                            </div>
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ background: `${stat.color}20` }}
                            >
                              {iconMap[stat.title]}
                            </div>
                          </div>
                          <Progress
                            percent={stat.progress || 0}
                            showInfo={false}
                            strokeColor={stat.color}
                            trailColor="transparent"
                          />
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Row gutter={[16, 16]} align="stretch">
                  <Col
                    xs={24}
                    lg={16}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Card
                      title="Company Registrations (Last 6 Months)"
                      className="shadow-md rounded-lg"
                      style={{ flex: 1 }}
                    >
                      {companyRegistrations.labels?.length > 0 ? (
                        <div className="h-80">
                          <Bar
                            data={companyRegistrations}
                            options={chartOptions}
                          />
                        </div>
                      ) : (
                        <Text className="text-gray-500">
                          No registration data available
                        </Text>
                      )}
                    </Card>
                    <Card
                      title="License Status Distribution"
                      className="shadow-md rounded-lg"
                      style={{ flex: 1 }}
                    >
                      {licenseDistribution.labels?.length > 0 ? (
                        <div className="h-80">
                          <Doughnut
                            data={licenseChartData}
                            options={licenseChartOptions}
                          />
                        </div>
                      ) : (
                        <Text className="text-gray-500">
                          No license data available
                        </Text>
                      )}
                    </Card>
                  </Col>

                  <Col
                    xs={24}
                    lg={8}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <Card
                      title="Recent Activities"
                      className="shadow-md rounded-lg"
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div className="overflow-y-auto flex-1">
                        <Space
                          direction="vertical"
                          size="middle"
                          className="w-full"
                        >
                          {activities.map((activity) => (
                            <div key={activity.key}>
                              <div className="flex justify-between">
                                <Text strong className="text-gray-800">
                                  {activity.activity}
                                </Text>
                                <Text className="text-gray-500">
                                  {activity.time}
                                </Text>
                              </div>
                              <Text
                                className={
                                  activity.status === "completed"
                                    ? "text-green-500"
                                    : activity.status === "pending"
                                    ? "text-yellow-500"
                                    : "text-blue-500"
                                }
                              >
                                {activity.status}
                              </Text>
                              <Divider className="my-3" />
                            </div>
                          ))}
                        </Space>
                      </div>
                    </Card>
                    <Card
                      title="Calendar"
                      className="shadow-md rounded-lg"
                      style={{ flex: 1 }}
                    >
                      <div className="h-full">
                        <Calendar
                          mode="month"
                          fullscreen={false}
                          className="border-none"
                          headerRender={({ value, onChange }) => (
                            <div className="flex justify-between items-center p-2">
                              <Text strong className="text-gray-800">
                                {value.format("MMMM YYYY")}
                              </Text>
                              <Space>
                                <button
                                  className="text-gray-600 hover:text-gray-800"
                                  onClick={() =>
                                    onChange(value.clone().subtract(1, "month"))
                                  }
                                >
                                  &lt;
                                </button>
                                <button
                                  className="text-gray-600 hover:text-gray-800"
                                  onClick={() =>
                                    onChange(value.clone().add(1, "month"))
                                  }
                                >
                                  &gt;
                                </button>
                              </Space>
                            </div>
                          )}
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
