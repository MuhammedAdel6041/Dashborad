import   {  useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes

const UpdateUserModal = ({ visible, onClose, user, onSuccess, token }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleUpdate = async (values) => {
    try {
      await axios.patch(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users/${user._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("User updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to update user. Please try again.");
    }
  };

  return (
    <Modal
      title="Update User"
      visible={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleUpdate}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Define prop types for UpdateUserModal
UpdateUserModal.propTypes = {
  visible: PropTypes.bool.isRequired, // `visible` is required and must be a boolean
  onClose: PropTypes.func.isRequired, // `onClose` is required and must be a function
  user: PropTypes.shape({ // `user` is an object with specific properties
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired, // `onSuccess` is required and must be a function
  token: PropTypes.string.isRequired, // `token` is required and must be a string
};

export default UpdateUserModal;
