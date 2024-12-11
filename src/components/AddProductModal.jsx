 
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onSubmit({
          ...values,
          startDate: values.startDate.format('DD-MM-YYYY HH:mm A'),
          endDate: values.endDate.format('DD-MM-YYYY HH:mm A'),
        });
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Add Product"
      open={isOpen}
      onOk={handleOk}
      onCancel={onClose}
      okText="Add"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: 'Please input the product name!' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select the start date!' }]}
        >
          <DatePicker showTime format="DD-MM-YYYY HH:mm A" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select the end date!' }]}
        >
          <DatePicker showTime format="DD-MM-YYYY HH:mm A" />
        </Form.Item>
        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: 'Please input the stock quantity!' }]}
        >
          <InputNumber min={0} placeholder="Enter stock quantity" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="Upcoming">Upcoming</Select.Option>
            <Select.Option value="Ongoing">Ongoing</Select.Option>
            <Select.Option value="Expired">Expired</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Add PropTypes validation
AddProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure isOpen is a required boolean
  onClose: PropTypes.func.isRequired, // Ensure onClose is a required function
  onSubmit: PropTypes.func.isRequired, // Ensure onSubmit is a required function
};

export default AddProductModal;
