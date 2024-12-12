/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from 'react';
import { Table, Button, message, Popconfirm, Tag, Image } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';
import { useAuth } from '../context/AuthContext';  // Import useAuth to access the token

// Fetch products from the API
const fetchProducts = async () => {
  const response = await axios.get('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/products');
  return response.data.data;
};

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useAuth();  // Access the auth context to get the token

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    onError: (err) => {
      console.error(err);
      message.error('Failed to fetch products. Please try again.');
    },
  });

  const handleAddSuccess = () => {
    message.success('Product added successfully!');
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Log the productId to check if it's valid
      console.log('Deleting product with ID:', productId);

      // Optimistic update: Remove product immediately from the UI
      queryClient.setQueryData(['products'], (oldData) =>
        oldData.filter((product) => product._id !== productId)
      );

      // Make the API request to delete the product with authentication token
      const response = await axios.delete(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,  // Add token to headers
          },
        }
      );
      console.log('Delete response:', response);  // Log the response from the API

      message.success('Product deleted successfully!');

      // Optionally, you can re-fetch the products from the server to get the latest data
      queryClient.invalidateQueries(['products']);
    } catch (error) {
      // Log the full error response to understand the issue
      console.error('Delete error:', error.response || error);  // Check if there's a response from the server

      // Display error message based on the status code or error message
      if (error.response) {
        const { status, data } = error.response;
        message.error(`Failed to delete product. Status: ${status}, Message: ${data.message || 'Unknown error'}`);
      } else {
        message.error('Failed to delete product. Please try again.');
      }

      // If the delete fails, rollback the optimistic update
      queryClient.invalidateQueries(['products']);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imagecover',
      key: 'imagecover',
      render: (image) => (
        <Image
          width={60}
          height={60}
          src={image}
          alt="Product"
          style={{ objectFit: 'cover' }}
          preview={{ src: image }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>${price}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category.name}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}  // Pass the product ID to the handler
            onCancel={() => setDeletingProduct(null)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Product
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        loading={isLoading}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        scroll={{ x: true }}
      />
      <AddProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Products;
