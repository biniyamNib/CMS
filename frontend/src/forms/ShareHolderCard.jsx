import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Table, 
  Descriptions, 
  Alert, 
  Typography, 
  Tag,
  Divider,
  Space,
  Statistic
} from 'antd';
import { fetchShareholder } from '../slices/shareholderSlice';

const { Title, Text } = Typography;

const ShareholderCard = ({ shareholderId }) => {
  const dispatch = useDispatch();
  const { currentShareholder, loading } = useSelector((state) => state.shareholders);

  useEffect(() => {
    if (shareholderId) {
      dispatch(fetchShareholder(shareholderId));
    }
  }, [dispatch, shareholderId]);

  if (loading) {
    return <Alert message="Loading shareholder details..." type="info" showIcon />;
  }

  if (!currentShareholder) {
    return <Alert message="No shareholder data available" type="warning" showIcon />;
  }

  const columns = [
    {
      title: 'Company Name',
      dataIndex: ['Company', 'CompanyName'],
      key: 'CompanyName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Shares',
      dataIndex: 'ShareQt',
      key: 'ShareQt',
      render: (value) => value?.toLocaleString() ?? '0',
    },
    {
      title: 'Share Value',
      dataIndex: 'ShareValue',
      key: 'ShareValue',
      render: (value) => (
        <Statistic
          value={value || 0}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: 14 }}
        />
      ),
    },
  ];

  const totalShares = currentShareholder.CompanyMappings?.reduce(
    (sum, mapping) => sum + (mapping.ShareQt || 0), 0
  ) || 0;

  const totalValue = currentShareholder.CompanyMappings?.reduce(
  (sum, mapping) => {
    const shareValue = Number(mapping.ShareValue) || 0; // Ensure numeric value
    return sum + shareValue;
  }, 0
  ) || 0;

  // const totalValue = currentShareholder.CompanyMappings?.reduce(
  //   (sum, mapping) => sum + (mapping.ShareValue || 0), 0
  // ) || 0;

  return (
    <Card loading={loading}>
      <Descriptions 
        title="Shareholder Information" 
        bordered 
        column={1}
        size="small"
      >
        <Descriptions.Item label="Name">
          <Text strong>{currentShareholder.ShareholderName || 'N/A'}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Holdings Summary</Divider>
      
      <Space size="large" className="mb-4">
        <Statistic title="Total Companies" value={currentShareholder.CompanyMappings?.length || 0} />
        <Statistic title="Total Shares" value={totalShares.toLocaleString()} />
        <Statistic 
          title="Total Value" 
          value={totalValue} 
          precision={2} 
          prefix="$" 
        />
      </Space>

      <Divider orientation="left">Company Holdings</Divider>
      
      {(!currentShareholder.CompanyMappings || currentShareholder.CompanyMappings.length === 0) ? (
        <Alert message="No company holdings found" type="info" />
      ) : (
        <Table
          columns={columns}
          dataSource={currentShareholder.CompanyMappings}
          rowKey={(record) => `${record.ShareholderId}-${record.CompanyId}`}
          pagination={false}
          size="small"
        />
      )}
    </Card>
  );
};

export default ShareholderCard;