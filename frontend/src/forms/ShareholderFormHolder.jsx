import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, Button, Typography, Divider } from 'antd';
import { createShareholder, updateShareholder, fetchShareholder } from '../slices/shareholderSlice';

const { Title } = Typography;

const ShareholderForm = ({ open, shareholderId, onClose }) => {
  const dispatch = useDispatch();
  const { currentShareholder, loading } = useSelector((state) => state.shareholders);
  const [form] = Form.useForm();

  useEffect(() => {
    if (shareholderId) {
      dispatch(fetchShareholder(shareholderId));
    }
    return () => {
      form.resetFields();
    };
  }, [dispatch, shareholderId, form]);

  useEffect(() => {
    if (currentShareholder && shareholderId === currentShareholder.ShareholderId) {
      form.setFieldsValue({ name: currentShareholder.ShareholderName });
    } else {
      form.resetFields();
    }
  }, [currentShareholder, shareholderId, form]);

  const onFinish = async (values) => {
    try {
      const payload = { ShareholderName: values.name };
      
      if (shareholderId) {
        await dispatch(updateShareholder({
          shareholderId,
          data: payload
        })).unwrap();
      } else {
        await dispatch(createShareholder(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Form submission failed:', err);
    }
  };

  return (
    <Modal
      title={<Title level={4}>{shareholderId ? 'Edit Shareholder' : 'Add Shareholder'}</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Shareholder Name"
          rules={[{ required: true, message: 'Please enter shareholder name' }]}
        >
          <Input placeholder="Enter shareholder name" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {shareholderId ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShareholderForm;