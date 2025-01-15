import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Upload, Form } from "antd";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes

export default function AddBrandModal({ visible, onClose, onAddSuccess }) {
  const { auth } = useAuth(); // Access token for authorization
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [imagePreview, setImagePreview] = useState(null); // Preview for the image

  // Handle form submission
  const handleAddBrand = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    if (imageFile) formData.append("image", imageFile); // Append image file if it exists

    try {
      await axios.post(
        "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/brands",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Brand added successfully!"); // Show success message
      onAddSuccess(); // Trigger success callback
      form.resetFields(); // Reset form fields
      setImagePreview(null); // Reset image preview
      onClose(); // Close the modal
    } catch (error) {
      console.error("Add brand error:", error.response || error);
      message.error("Failed to add brand. Please try again."); // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Brand"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAddBrand}>
        <Form.Item
          label="Brand Name"
          name="name"
          rules={[{ required: true, message: "Please enter brand name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Brand Image (Upload)"
          name="image"
          rules={[{ required: true, message: "Please upload an image" }]}
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
                alt="Brand"
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
            Add Brand
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// Add PropTypes validation
AddBrandModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSuccess: PropTypes.func.isRequired,
};
