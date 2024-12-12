/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Button, message, Select } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AddProductModal = ({ visible, onClose, onAddSuccess }) => {
  const { auth } = useAuth(); // Access the auth context to get the token
  const [categories, setCategories] = useState([]); // State to store categories
  const [loadingCategories, setLoadingCategories] = useState(false); // Loading state for categories
  const [hasMore, setHasMore] = useState(true); // State to track if there are more categories to fetch
  const [page, setPage] = useState(1); // State for pagination
  const [imageFile, setImageFile] = useState(null); // For storing image cover file
  const [imageCoverFile, setImageCoverFile] = useState(null); // For storing image cover file

  // Fetch categories when the component mounts or page changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!hasMore) return; // If there are no more categories, stop fetching

      setLoadingCategories(true);
      try {
        const response = await axios.get('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/categories', {
          params: {
            page,
            limit: 315, // Adjust limit if needed
          },
        });

        // Access the categories data inside response.data.data
        const categoriesData = response.data.data;

        if (Array.isArray(categoriesData)) {
          setCategories((prevCategories) => [
            ...prevCategories,
            ...categoriesData, // Append new categories
          ]);

          // Check if there are more categories to fetch
          if (categoriesData.length < 315) {
            setHasMore(false); // No more categories left
          } else {
            setPage(page + 1); // Move to the next page
          }
        } else {
          console.error('Categories data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to fetch categories.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [page, hasMore]);

  // Formik initial values and validation schema
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      priceAfterDiscount: 0,
      quantity: 0,
      color: '',
      imagecover: '',
      image: '',
      category: '',
      title: '',
      sold: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().min(0, 'Price cannot be less than 0').required('Price is required'),
      quantity: Yup.number().min(0, 'Quantity cannot be less than 0').required('Quantity is required'),
      imagecover: Yup.mixed().required('Cover image is required'),
      image: Yup.mixed().required('Product image is required'),
      category: Yup.string().required('Category is required'),
      title: Yup.string().required('Product title is required'),
      sold: Yup.number().min(0, 'Sold value cannot be negative').required('Sold value is required'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('priceAfterDiscount', values.priceAfterDiscount);
        formData.append('quantity', values.quantity);
        formData.append('color', values.color ? values.color.split(',') : []); // Convert color to array if provided
        formData.append('imagecover', imageCoverFile); // Add image cover file
        formData.append('image', imageFile); // Add product image file
        formData.append('category', values.category); // Send category ID
        formData.append('title', values.title);
        formData.append('sold', values.sold); // Add sold field

        // Make the POST request
        const response = await axios.post(
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/products',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
            },
          }
        );

        // Check if the response is successful
        if (response.status === 201) {
          message.success('Product added successfully!');
          onAddSuccess(); // Callback to refresh the product list
          onClose(); // Close the modal
          formik.resetForm(); // Reset the form
        } else {
          throw new Error('Failed to add product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
        message.error('Failed to add product. Please try again.');
      }
    },
  });

  // Handling image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageCoverFile(file);
    }
  };

  return (
    <Modal
      title="Add Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form onSubmit={formik.handleSubmit} layout="vertical">
        <Form.Item label="Product Name">
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter product name"
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: 'red' }}>{formik.errors.name}</div>
          )}
        </Form.Item>

        <Form.Item label="Description">
          <Input
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter product description"
          />
          {formik.touched.description && formik.errors.description && (
            <div style={{ color: 'red' }}>{formik.errors.description}</div>
          )}
        </Form.Item>

        <Form.Item label="Price">
          <InputNumber
            name="price"
            value={formik.values.price}
            onChange={(value) => formik.setFieldValue('price', value)}
            onBlur={formik.handleBlur}
            style={{ width: '100%' }}
            placeholder="Enter product price"
          />
          {formik.touched.price && formik.errors.price && (
            <div style={{ color: 'red' }}>{formik.errors.price}</div>
          )}
        </Form.Item>

        <Form.Item label="Price After Discount">
          <InputNumber
            name="priceAfterDiscount"
            value={formik.values.priceAfterDiscount}
            onChange={(value) => formik.setFieldValue('priceAfterDiscount', value)}
            onBlur={formik.handleBlur}
            style={{ width: '100%' }}
            placeholder="Enter price after discount"
          />
        </Form.Item>

        <Form.Item label="Quantity">
          <InputNumber
            name="quantity"
            value={formik.values.quantity}
            onChange={(value) => formik.setFieldValue('quantity', value)}
            onBlur={formik.handleBlur}
            style={{ width: '100%' }}
            placeholder="Enter quantity"
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <div style={{ color: 'red' }}>{formik.errors.quantity}</div>
          )}
        </Form.Item>

        <Form.Item label="Color (comma separated)">
          <Input
            name="color"
            value={formik.values.color}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter product colors"
          />
        </Form.Item>

        <Form.Item label="Cover Image">
          <input
            type="file"
            onChange={handleImageCoverChange}
            accept="image/*"
            required
          />
          {formik.touched.imagecover && formik.errors.imagecover && (
            <div style={{ color: 'red' }}>{formik.errors.imagecover}</div>
          )}
        </Form.Item>

        <Form.Item label="Product Image">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {formik.touched.image && formik.errors.image && (
            <div style={{ color: 'red' }}>{formik.errors.image}</div>
          )}
        </Form.Item>

        <Form.Item label="Category">
          <Select
            name="category"
            value={formik.values.category}
            onChange={(value) => formik.setFieldValue('category', value)}
            loading={loadingCategories}
            placeholder="Select category"
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option value="" disabled>No categories available</Select.Option>
            )}
          </Select>
          {formik.touched.category && formik.errors.category && (
            <div style={{ color: 'red' }}>{formik.errors.category}</div>
          )}
        </Form.Item>

        <Form.Item label="Product Title">
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter product title"
          />
          {formik.touched.title && formik.errors.title && (
            <div style={{ color: 'red' }}>{formik.errors.title}</div>
          )}
        </Form.Item>

        <Form.Item label="Sold">
          <InputNumber
            name="sold"
            value={formik.values.sold}
            onChange={(value) => formik.setFieldValue('sold', value)}
            onBlur={formik.handleBlur}
            style={{ width: '100%' }}
            placeholder="Enter number of units sold"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
