import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Modal, Select, Upload, Form } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes

export default function AddProductModal({ visible, onClose, onAddSuccess }) {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth(); // Access token for authorization
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]); // State for categories
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [imageCoverFile, setImageCoverFile] = useState(null); // State for image cover file

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/categories');
        setCategories(response.data.data); // Set the categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission
  const handleAddProduct = async (values) => {
    setLoading(true);

    // Create FormData to send the image and image cover as files
    const formData = new FormData();

    // Append text fields (excluding image and imagecover)
    Object.keys(values).forEach((key) => {
      if (key !== 'image' && key !== 'imagecover') {
        formData.append(key, values[key]);
      }
    });

    // Append the image and image cover files if they are selected
    if (imageFile) formData.append('image', imageFile);
    if (imageCoverFile) formData.append('imagecover', imageCoverFile);

    try {
      // Make API request to add the product
      await axios.post(
        'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/products',
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,  // Add token to headers
            'Content-Type': 'multipart/form-data',  // Important for sending files
          },
        }
      );

      // Show success message and close the modal
      message.success('Product added successfully!');
      onAddSuccess(); // Trigger success callback in parent component
      form.resetFields(); // Reset the form
      onClose(); // Close modal after adding product

      // Console log the data being sent
      console.log('Form data submitted:', values);
      console.log('Selected Category ID:', values.category);  // Log selected category ID
      console.log('Image file:', imageFile);
      console.log('Image Cover file:', imageCoverFile);
    } catch (error) {
      console.error('Add product error:', error.response || error);
      message.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    setImageFile(file);
    return false; // Prevent automatic upload
  };

  // Handle image cover upload
  const handleImageCoverUpload = (file) => {
    setImageCoverFile(file);
    return false; // Prevent automatic upload
  };

  return (
    <Modal
      title="Add Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      onOk={() => form.submit()} // Trigger form submit when clicking the OK button
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddProduct}
      >
        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: 'Please enter product title' }]} >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Please enter product name' }]} >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter product description' }]} >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please enter quantity' }]} >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Sold"
          name="sold"
          rules={[{ required: true, message: 'Please enter sold quantity' }]} >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please enter product price' }]} >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Price After Discount"
          name="priceAfterDiscount"
          rules={[{ required: true, message: 'Please enter price after discount' }]} >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[{ required: true, message: 'Please enter product color' }]} >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category' }]} >
          <Select>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Product Image URL (Cover)"
          name="imagecover"
          rules={[{ required: true, message: 'Please provide an image URL' }]} >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Image (Upload)"
          name="image"
          rules={[{ required: true, message: 'Please upload an image' }]} >
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            fileList={imageFile ? [imageFile] : []} // Pass fileList as an array
            beforeUpload={handleImageUpload} // Custom upload logic
          >
            <div>
              <UploadOutlined /> Click to upload
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Product Image Cover (Upload)"
          name="imagecover"
          rules={[{ required: true, message: 'Please upload an image cover' }]} >
          <Upload
            name="imagecover"
            listType="picture-card"
            showUploadList={false}
            fileList={imageCoverFile ? [imageCoverFile] : []} // Pass fileList as an array
            beforeUpload={handleImageCoverUpload} // Custom upload logic
          >
            <div>
              <UploadOutlined /> Click to upload
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            disabled={loading} // Disable submit button while loading
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Add PropTypes validation
AddProductModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSuccess: PropTypes.func.isRequired,
};
