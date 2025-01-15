import { useState } from "react";
import { Table, Button, message, Popconfirm, Image, Spin, Alert } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access the token
import AddBrandModal from '../components/AddBrandModal'; // Import the modal component

// Fetch brands from the API
const fetchBrands = async (token) => {
  const response = await axios.get('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/brands', {
    headers: {
      Authorization: `Bearer ${token}`, // Use the auth token
    },
  });
  return response.data.data;
};

const Brand = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useAuth(); // Access the auth context to get the token

  const { data: brands, isLoading, isError, error } = useQuery({
    queryKey: ['brands', auth.token],
    queryFn: () => fetchBrands(auth.token),
    onError: (err) => {
      console.error(err);
      message.error('Failed to fetch brands. Please try again.');
    },
  });

  const handleAddSuccess = () => {
    message.success('Brand added successfully!');
    setIsModalVisible(false); // Close the modal on success
    queryClient.invalidateQueries(['brands']); // Refresh the brand data
  };

  const handleDeleteBrand = async (brandId) => {
    try {
        const response = await axios.delete(
          `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/brands/delete/${brandId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        console.log('Delete response:', response);  // Log the full response object
      
        message.success('Brand deleted successfully!');
        queryClient.invalidateQueries(['brands']);
      } catch (error) {
        console.error('Delete error:', error.response || error); // Log the full error response
      
        if (error.response) {
          const { status, data } = error.response;
          message.error(`Failed to delete brand. Status: ${status}, Message: ${data.message || 'Unknown error'}`);
        } else {
          message.error('Failed to delete brand. Please try again.');
        }
      
        queryClient.invalidateQueries(['brands']);
      }
      
  };
  
  const columns = [
    {
      title: 'Brand Image',
      dataIndex: 'image',
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          alt="Brand"
          style={{ objectFit: 'cover' }}
          preview={{ src: image }}
        />
      ),
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(), // Format date
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleString(), // Format date
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this brand?"
            onConfirm={() => handleDeleteBrand(record._id)} // Pass the brand ID to the handler
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

  // Render loading state
  if (isLoading) return <Spin size="large" className="w-full h-full flex justify-center items-center" />;

  // Render error message
  if (isError) return <Alert message={error.message} type="error" className="mb-4" />;

  // Render brand table
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Brand List</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Brand
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="_id" // Unique key for each row
        pagination={{ pageSize: 10 }} // Pagination options
        bordered
        size="middle"
        scroll={{ x: true }}
      />
      <AddBrandModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Close the modal
        onAddSuccess={handleAddSuccess} // Callback after a successful add
      />
    </div>
  );
};

export default Brand;
