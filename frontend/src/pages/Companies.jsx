import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Avatar,
  Tag,
  Table,
  Modal,
  Alert,
  Statistic,
  Divider,
  theme,
  List,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  BankOutlined,
} from "@ant-design/icons";
import {
  fetchCompanies,
  deleteCompany,
  clearError,
} from "../slices/companySlice";
import EditCompany from "../edit/EditCompany.jsx";
import SubCompanies from "../edit/SubCompanies.jsx";
import AddCompany from "../forms/AddCompany.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, loading, error } = useSelector((state) => state.companies);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditModalOpen(true);
  };

  const handleSubCompanies = (company) => {
    console.log("Selected Company:", company);
    setSelectedCompany(company);
    setSubModalOpen(true);
  };

  const handleDelete = (id) => {
    confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this company?",
      onOk: async () => {
        await dispatch(deleteCompany(id));
      },
    });
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "CompanyName",
      key: "CompanyName",
      render: (text, record) => (
        <Space>
          {record.Logo ? (
            <Avatar src={record.Logo} size="large" />
          ) : (
            <Avatar icon={<BankOutlined />} size="large" />
          )}
          <Text strong>{text || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary">Type: {record.Type || "N/A"}</Text>
          <Text type="secondary">TIN: {record.TinNo || "N/A"}</Text>
          <Text type="secondary">Reg No: {record.RegistrationNo || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Financials",
      key: "financials",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Statistic
            value={record.RegisteredCapital || 0}
            precision={2}
            prefix="$"
            valueStyle={{ fontSize: "14px" }}
          />
          <Text type="secondary">
            Shareholders: {record.NoOfShareholders || 0}
          </Text>
        </Space>
      ),
    },
    {
      title: "Relationships",
      key: "relationships",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary">
            Parent: {record.ParentCompany?.CompanyName || "None"}
          </Text>
          <Text type="secondary">Subs: {record.SubCompanies?.length || 0}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleSubCompanies(record)}
          >
            Subs
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.CompanyId)}
          />
        </Space>
      ),
    },
  ];

  if (!Array.isArray(companies)) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ padding: 24 }}>
            <Alert
              message="Error"
              description="Invalid company data format"
              type="error"
              showIcon
            />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            flex: 1,
            margin: "88px 16px 24px",
            marginLeft: collapsed ? 96 : 266,
            padding: 24,
            background: "#F5F5F5",
            minHeight: 280,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={3} style={{ marginBottom: 0 }}>
                Companies
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddModalOpen(true)}
              >
                Add Company
              </Button>
            </div>
            {error && (
              <Alert
                message={error.message || "Error"}
                description={
                  <>
                    {error.details || "An error occurred"}
                    {error.subCompanies && (
                      <div style={{ marginTop: "10px" }}>
                        <Text strong>Sub-companies:</Text>
                        <ul>
                          {error.subCompanies.map((sub) => (
                            <li key={sub.id}>{sub.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {error.licenses && (
                      <div style={{ marginTop: "10px" }}>
                        <Text strong>Licenses:</Text>
                        <ul>
                          {error.licenses.map((license) => (
                            <li key={license.id}>{license.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                }
                type="error"
                showIcon
                closable
                onClose={() => dispatch(clearError())}
                action={
                  <Button
                    size="small"
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={() => dispatch(fetchCompanies())}
                  />
                }
              />
            )}

            <Card loading={loading}>
              <Table
                columns={columns}
                dataSource={companies}
                rowKey="CompanyId"
                pagination={{ pageSize: 10 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ margin: 0 }}>
                      <Divider orientation="left">
                        Sub-Companies
                      </Divider>
                      {record.SubCompanies?.length ? (
                        <List
                          size="small"
                          bordered
                          dataSource={record.SubCompanies}
                          renderItem={(sub) => (
                            <List.Item key={sub.CompanyId}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Text strong>{sub.CompanyName || 'N/A'}</Text>
                                <Tag color={sub.Status === 'Active' ? 'green' : 'red'}>
                                  {sub.Status || 'N/A'}
                                </Tag>
                              </div>
                            </List.Item>
                          )}
                          style={{ marginBottom: 16 }}
                        />
                      ) : (
                        <Text type="secondary">No sub-companies</Text>
                      )}
                      <Divider orientation="left">
                        Additional Information
                      </Divider>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Text strong>Established:</Text>{" "}
                          {record.EstablishedDate
                            ? new Date(record.EstablishedDate).toLocaleDateString()
                            : "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Top Position:</Text>{" "}
                          {record.TopPosition || "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Address:</Text>{" "}
                          {record.Address || "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Phone:</Text>{" "}
                          {record.Phone || "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Email:</Text>{" "}
                          {record.Email || "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Registered Capital:</Text>{" "}
                          {typeof record.RegisteredCapital === 'number' && !isNaN(record.RegisteredCapital)
                            ? `$${record.RegisteredCapital.toFixed(2)}`
                            : typeof record.RegisteredCapital === 'string' && !isNaN(parseFloat(record.RegisteredCapital))
                            ? `$${parseFloat(record.RegisteredCapital).toFixed(2)}`
                            : "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Subscribed Capital:</Text>{" "}
                          {typeof record.SubscribedCapital === 'number' && !isNaN(record.SubscribedCapital)
                            ? `$${record.SubscribedCapital.toFixed(2)}`
                            : typeof record.SubscribedCapital === 'string' && !isNaN(parseFloat(record.SubscribedCapital))
                            ? `$${parseFloat(record.SubscribedCapital).toFixed(2)}`
                            : "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Share Value:</Text>{" "}
                          {typeof record.ShareValue === 'number' && !isNaN(record.ShareValue)
                            ? `$${record.ShareValue.toFixed(2)}`
                            : typeof record.ShareValue === 'string' && !isNaN(parseFloat(record.ShareValue))
                            ? `$${parseFloat(record.ShareValue).toFixed(2)}`
                            : "N/A"}
                        </Col>
                        <Col span={8}>
                          <Text strong>Registered Share Quantity:</Text>{" "}
                          {record.RegisteredShareQt || 0}
                        </Col>
                        <Col span={8}>
                          <Text strong>Subscribed Share Quantity:</Text>{" "}
                          {record.SubscribedShareQt || 0}
                        </Col>
                      </Row>
                    </div>
                  ),
                }}
              />
            </Card>

            <EditCompany
              open={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedCompany(null);
              }}
              company={selectedCompany}
            />

            <SubCompanies
              open={subModalOpen}
              onClose={() => {
                setSubModalOpen(false);
                setSelectedCompany(null);
              }}
              company={selectedCompany}
              onSuccess={() => {
                dispatch(fetchCompanies());
              }}
            />

            <AddCompany
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
            />
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Companies;