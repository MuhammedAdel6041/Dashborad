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
  const [imagePreview, setImagePreview] = useState(null); // Preview for the image
  const [imageCoverPreview, setImageCoverPreview] = useState(null); // Preview for the image cover

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
  
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key !== 'image' && key !== 'imagecover') {
        formData.append(key, values[key]);
      }
    });
    if (imageFile) formData.append('image', imageFile);
    if (imageCoverFile) formData.append('imagecover', imageCoverFile);
  
    try {
      await axios.post(
        'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/products',
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Trigger success message only here
      message.success('Product added successfully!');
      
      onAddSuccess(); // This should only trigger re-fetching or updates, without another message
      form.resetFields();
      setImagePreview(null);
      setImageCoverPreview(null);
      onClose();
    } catch (error) {
      console.error('Add product error:', error.response || error);
      message.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Cover Image URL */}
        <Form.Item
          label="Product Image Cover URL"
          name="imagecoverurl"
          rules={[{ required: false, message: 'Please enter an image URL for the product cover' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Image (Upload)"
          name="image"
          rules={[{ required: true, message: 'Please upload an image' }]}
        >
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file)); // Set preview URL
              return false; // Prevent automatic upload
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div>
                <UploadOutlined /> Click to upload
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Product Image Cover (Upload)"
          name="imagecover"
          rules={[{ required: false, message: 'Please upload an image cover' }]}
        >
          <Upload
            name="imagecover"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              setImageCoverFile(file);
              setImageCoverPreview(URL.createObjectURL(file)); // Set preview URL
              return false; // Prevent automatic upload
            }}
          >
            {imageCoverPreview ? (
              <img
                src={imageCoverPreview}
                alt="Product Cover"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div>
                <UploadOutlined /> Click to upload
              </div>
            )}
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
