import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Layout, 
  Table, 
  Spin, 
  Alert, 
  Card, 
  Button, 
  Select, 
  Space, 
  Typography, 
  Breadcrumb, 
  Empty, 
  message, 
  DatePicker
} from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchDesignationSummary } from '../slices/reportSlice';
import { fetchCompanies } from '../slices/companySlice';
import { CSVLink } from 'react-csv';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend 
} from 'chart.js';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Reports = () => {
  const dispatch = useDispatch();
  const { designationSummary = [], loading: reportLoading, error: reportError } = useSelector((state) => state.reports);
  const { companies = [], loading: companyLoading, error: companyError } = useSelector((state) => state.companies);
  const [reportType, setReportType] = useState('designation-summary');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [filteredDepartment, setFilteredDepartment] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies())
      .unwrap()
      .catch(err => message.error(`Failed to fetch companies: ${err.message}`));
  }, [dispatch]);

  useEffect(() => {
    if (reportType === 'designation-summary') {
      const [startDate, endDate] = dateRange || [null, null];
      dispatch(fetchDesignationSummary({
        companyId: selectedCompanyId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }))
        .unwrap()
        .catch(err => message.error(`Failed to fetch designation summary: ${err.message}`));
    }
  }, [dispatch, reportType, selectedCompanyId, dateRange]);

  const columns = useMemo(() => [
    {
      title: 'Company',
      dataIndex: ['Company', 'CompanyName'],
      sorter: (a, b) => (a.Company?.CompanyName || '').localeCompare(b.Company?.CompanyName || ''),
      render: (text) => text || 'N/A',
    },
    {
      title: 'Department',
      dataIndex: 'StructureName',
      sorter: (a, b) => (a.StructureName || '').localeCompare(b.StructureName || ''),
      render: (text) => text || 'N/A',
    },
    {
      title: 'Designation Count',
      dataIndex: 'DesignationCount',
      sorter: (a, b) => (a.DesignationCount || 0) - (b.DesignationCount || 0),
      render: (count) => count || 0,
    },
  ], []);

  const filteredData = useMemo(() => {
    if (!filteredDepartment) return designationSummary;
    return designationSummary.filter(item => item.StructureName === filteredDepartment);
  }, [designationSummary, filteredDepartment]);

  const csvData = useMemo(() => filteredData.map((item) => ({
    Company: item.Company?.CompanyName || 'N/A',
    Department: item.StructureName || 'N/A',
    DesignationCount: item.DesignationCount || 0,
  })), [filteredData]);

  const chartData = useMemo(() => ({
    labels: designationSummary.map(item => item.StructureName || 'N/A'),
    datasets: [
      {
        label: 'Designation Count',
        data: designationSummary.map(item => item.DesignationCount || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }), [designationSummary]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Designation Count by Department',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Designations' } },
      x: { title: { display: true, text: 'Department' } },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const department = designationSummary[index]?.StructureName || null;
        setFilteredDepartment(department);
        message.info(`Filtered table to show ${department || 'all departments'}`);
      }
    },
  };

  const handleExport = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      message.success('CSV export completed');
    }, 500); // Simulate export processing
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Content 
          style={{
            flex: 1,
            margin: '88px 16px 24px',
            marginLeft: collapsed ? 96 : 266,
            padding: 24,
            background: '#F5F5F5',
            minHeight: 280,
            transition: 'margin-left 0.3s ease',
          }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ marginBottom: 0}}>
                Reports
              </Title>
              <Space size="middle">
                <Select
                  value={reportType}
                  onChange={(value) => setReportType(value)}
                  style={{ width: 200 }}
                  placeholder="Select Report Type"
                >
                  <Option value="designation-summary">Designation Summary</Option>
                </Select>
                <Select
                  value={selectedCompanyId}
                  onChange={(value) => setSelectedCompanyId(value)}
                  placeholder="Select Company"
                  style={{ width: 200 }}
                  allowClear
                  loading={companyLoading}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {companies.map((company) => (
                    <Option key={company.CompanyId} value={company.CompanyId}>
                      {company.CompanyName}
                    </Option>
                  ))}
                </Select>
                <RangePicker
                  onChange={(dates) => setDateRange(dates)}
                  style={{ width: 250 }}
                  placeholder={['Start Date', 'End Date']}
                />
              </Space>
            </div>

            <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.95)' }}>
              {(reportLoading || companyLoading) && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Spin size="large" tip="Loading report data..." />
                </div>
              )}

              {(reportError || companyError) && (
                <Alert
                  message="Error"
                  description={reportError || companyError}
                  type="error"
                  showIcon
                  action={
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        dispatch(fetchCompanies());
                        dispatch(fetchDesignationSummary({
                          companyId: selectedCompanyId,
                          startDate: dateRange[0]?.toISOString(),
                          endDate: dateRange[1]?.toISOString(),
                        }));
                      }}
                    />
                  }
                  style={{ marginBottom: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 8 }}
                />
              )}

              {!reportLoading && !reportError && !companyLoading && !companyError && filteredData.length > 0 && (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {filteredDepartment && (
                    <Button
                      type="link"
                      onClick={() => {
                        setFilteredDepartment(null);
                        message.info('Showing all departments');
                      }}
                      style={{ padding: 0 }}
                    >
                      Clear Department Filter ({filteredDepartment})
                    </Button>
                  )}
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="OrgStructureId"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    bordered
                    style={{ background: '#fff', borderRadius: 8 }}
                    scroll={{ x: true }}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0, padding: 16 }}>
                          Additional details for {record.StructureName || 'N/A'} can be displayed here (e.g., designation list).
                        </p>
                      ),
                    }}
                  />

                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    loading={exportLoading}
                    onClick={handleExport}
                  >
                    <CSVLink
                      data={csvData}
                      filename={`designation-summary-${selectedCompanyId || 'all'}-${new Date().toISOString().slice(0,10)}.csv`}
                      className="text-white"
                    >
                      Export CSV
                    </CSVLink>
                  </Button>

                  <Card 
                    title="Designation Count by Department" 
                    style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.15)', background: '#fff' }}
                  >
                    <Bar data={chartData} options={chartOptions} />
                  </Card>
                </Space>
              )}

              {!reportLoading && !reportError && !companyLoading && !companyError && filteredData.length === 0 && (
                <Empty
                  description={
                    <Text type="secondary">
                      No designation summary data available
                      {selectedCompanyId ? ` for the selected company (ID: ${selectedCompanyId})` : ' for any company'}
                      {dateRange[0] ? ` from ${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1]?.format('YYYY-MM-DD') || 'now'}` : ''}.
                      Please ensure departments and designations are set up.
                    </Text>
                  }
                  style={{ padding: '40px', background: '#fff', borderRadius: 8 }}
                />
              )}
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Reports;


