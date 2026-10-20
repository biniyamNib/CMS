import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  message, 
  Modal, 
  Spin, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Card, 
  Space, 
  Tooltip,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  MinusOutlined, 
  InfoCircleOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies } from '../slices/companySlice';
import { fetchOrgStructures } from '../slices/orgStructureSlice';
import { createDesignation, updateDesignation, fetchAllDesignations } from '../slices/designationSlice';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const DesignationForm = ({ open, onClose, designationId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { companies, loading: companiesLoading } = useSelector((state) => state.companies);
  const { 
    orgStructures, 
    loading: orgStructuresLoading,
    error: orgStructuresError
  } = useSelector((state) => state.orgStructures);
  const { designations, loading: designationsLoading } = useSelector((state) => state.designations);
  const [qualifications, setQualifications] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (open && !isInitialized) {
      dispatch(fetchCompanies());
      setIsInitialized(true);
    }
  }, [open, isInitialized, dispatch]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchOrgStructures({ companyId: selectedCompanyId }));
    }
  }, [selectedCompanyId, dispatch]);

  useEffect(() => {
    if (open) {
      if (designationId && designations.length > 0) {
        const designation = designations.find(d => d.DesignationId === designationId);
        if (designation) {
          form.setFieldsValue({
            CompanyId: designation.CompanyId,
            OrgStructureId: designation.OrgStructureId,
            Name: designation.Name,
            JobDescription: designation.JobDescription,
            NoOfPosition: designation.NoOfPosition,
            isActive: designation.isActive,
          });
          setSelectedCompanyId(designation.CompanyId);
          setQualifications(designation.Qualifications || []);
        }
      } else {
        form.resetFields();
        setQualifications([]);
        setSelectedCompanyId(null);
      }
    }
  }, [open, designationId, designations, form]);

  const handleCompanyChange = (companyId) => {
    setSelectedCompanyId(companyId);
    form.setFieldsValue({ OrgStructureId: undefined });
  };

  const handleAddQualification = () => {
    setQualifications(prevQualifications => [
      ...prevQualifications,
      {
        QualificationName: '',
        ServiceYear: 0,
        RelatedServiceYear: 0,
        AllowRelatedQualification: false,
      },
    ]);
  };

  const handleQualificationChange = (index, field, value) => {
    setQualifications(prevQualifications => {
      const updatedQualifications = [...prevQualifications];
      updatedQualifications[index] = {
        ...updatedQualifications[index],
        [field]: value
      };
      return updatedQualifications;
    });
  };

  const handleRemoveQualification = (index) => {
    setQualifications(prevQualifications => prevQualifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        Qualifications: qualifications,
      };

      if (designationId) {
        await dispatch(updateDesignation({ designationId, designationData: payload })).unwrap();
        message.success('Designation updated successfully');
      } else {
        await dispatch(createDesignation(payload)).unwrap();
        await dispatch(fetchAllDesignations());
        message.success('Designation created successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(error.message || 'Failed to submit designation');
    }
  };

  return (
    <Modal
      title={<Title level={4}>{designationId ? 'Edit Designation' : 'Create New Designation'}</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <Spin spinning={companiesLoading || orgStructuresLoading}>
        {orgStructuresError && (
          <Alert 
            message="Error"
            description={orgStructuresError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form form={form} layout="vertical" preserve={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="CompanyId"
                label={
                  <span>
                    Company
                    <Tooltip title="Select the company this designation belongs to">
                      <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please select a company' }]}
              >
                <Select
                  placeholder="Select company"
                  loading={companiesLoading}
                  onChange={handleCompanyChange}
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
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="OrgStructureId"Z
                label={
                  <span>
                    Structure
                    <Tooltip title="Select the department or organizational structure for this designation">
                      <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please select a structure' }]}
              >
                <Select
                  placeholder={selectedCompanyId ? "Select structure" : "Select company first"}
                  loading={orgStructuresLoading}
                  disabled={!selectedCompanyId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {(orgStructures?.structures || orgStructures || []).map((structure) => (
                    <Option key={structure.OrgStructureId} value={structure.OrgStructureId}>
                      {structure.StructureName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="Name"
                label={
                  <span>
                    Designation Name
                    <Tooltip title="Enter a unique name for the designation (e.g., Senior Developer)">
                      <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please enter designation name' }]}
              >
                <Input placeholder="e.g., Senior Developer, Marketing Manager" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="NoOfPosition"
                label={
                  <span>
                    Number of Positions
                    <Tooltip title="Specify the number of available positions for this designation">
                      <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please enter number of positions' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="JobDescription"
            label={
              <span>
                Job Description
                <Tooltip title="Provide a detailed description of the role's responsibilities and requirements">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                </Tooltip>
              </span>
            }
          >
            <TextArea 
              rows={4} 
              placeholder="Enter detailed job description including responsibilities and requirements" 
              showCount 
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label={
              <span>
                Status
                <Tooltip title="Set whether this designation is currently active or inactive">
                  <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                </Tooltip>
              </span>
            }
            initialValue={true}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">Qualifications</Divider>

          <div style={{ marginBottom: 16 }}>
            <Button 
              type="dashed" 
              onClick={handleAddQualification} 
              icon={<PlusOutlined />}
              block
            >
              Add Qualification
            </Button>
          </div>

          {qualifications.map((qual, index) => (
            <Card 
              key={index} 
              size="small" 
              title={`Qualification #${index + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<MinusOutlined />}
                  onClick={() => handleRemoveQualification(index)}
                />
              }
              style={{ marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Qualification Name
                        <Tooltip title="Enter the name of the required qualification (e.g., Bachelor's Degree)">
                          <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Input
                      value={qual.QualificationName}
                      onChange={(e) => handleQualificationChange(index, 'QualificationName', e.target.value)}
                      placeholder="e.g., Bachelor's Degree, Certification"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span>
                        Service Years
                        <Tooltip title="Minimum years of service required">
                          <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <InputNumber
                      value={qual.ServiceYear}
                      onChange={(value) => handleQualificationChange(index, 'ServiceYear', value)}
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label={
                      <span>
                        Related Years
                        <Tooltip title="Minimum years in related fields">
                          <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <InputNumber
                      value={qual.RelatedServiceYear}
                      onChange={(value) => handleQualificationChange(index, 'RelatedServiceYear', value)}
                      min={0}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label={
                  <span>
                    Allow Related Qualification
                    <Tooltip title="Allow related qualifications to count towards requirements">
                      <InfoCircleOutlined style={{ marginLeft: 8, color: '#8c8c8c' }} />
                    </Tooltip>
                  </span>
                }
              >
                <Select
                  value={qual.AllowRelatedQualification}
                  onChange={(value) => handleQualificationChange(index, 'AllowRelatedQualification', value)}
                  style={{ width: '100%' }}
                >
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Card>
          ))}

          {qualifications.length > 0 && (
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              {qualifications.length} qualification{qualifications.length !== 1 ? 's' : ''} added
            </Text>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={designationsLoading}
            >
              {designationId ? 'Update Designation' : 'Create Designation'}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default DesignationForm;