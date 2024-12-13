import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types'; // Import PropTypes

const AddCategoryModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useAuth();
  const [imageFile, setImageFile] = useState(null);

  // Handle image upload
  const handleImageUpload = (file) => {
    setImageFile(file);
    return false; // Prevent automatic upload
  };

  const handleAddCategory = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', imageFile);

    try {
      await axios.post('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/categories', formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Category added successfully!');
      form.resetFields();
      onClose(); // Close modal after successful submission
    } catch (error) {
      message.error('Failed to add category. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Category"
      visible={visible}
      onCancel={onClose}
      footer={null}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleAddCategory}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: 'Please enter category name' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Category Image"
          name="image"
          rules={[{ required: true, message: 'Please upload an image' }]}>
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={handleImageUpload}>
            <div>
              <UploadOutlined /> Click to upload
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Prop validation
AddCategoryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddCategoryModal;
