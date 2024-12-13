import { useState } from 'react';
import { Card, Button, message, Popconfirm, Spin } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddCategoryModal from '../components/AddCategoryModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';  // Import the icons

const fetchCategories = async () => {
  const response = await axios.get('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/categories/?page=1&limit=315');
  return response.data.data;
};

const Category = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { auth } = useAuth(); // Access the token
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    onError: (err) => {
      console.error(err);
      message.error('Failed to fetch categories. Please try again.');
    },
  });

  const handleDeleteCategory = async (categoryId) => {
    try {
      // Optimistic UI update: Remove the category from the list immediately
      queryClient.setQueryData(['categories'], (oldData) =>
        oldData.filter((category) => category._id !== categoryId)
      );

      await axios.delete(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      message.success('Category deleted successfully!');
      queryClient.invalidateQueries(['categories']);
    } catch (error) {
      console.error(error);
      message.error('Failed to delete category. Please try again.');
      queryClient.invalidateQueries(['categories']); // Rollback changes if there's an error
    }
  };

  const handleEditCategory = (categoryId) => {
    // Your edit functionality logic goes here
    message.info(`Edit category with ID: ${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="category-list px-4 py-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Category
        </Button>
      </div>
      <div className="category-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card
            key={category._id}
            hoverable
            className="w-full max-w-xs p-4"
            cover={
              category.image ? (
                <img alt={category.name} src={category.image} className="object-cover h-40 w-full rounded-md" />
              ) : (
                <div className="object-cover h-40 w-full rounded-md bg-gray-300 flex justify-center items-center">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )
            }
          >
            <Card.Meta
              title={<h3 className="text-sm font-medium truncate">{category.name}</h3>}
            />
            <div className="flex justify-between mt-4">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditCategory(category._id)} // Trigger edit when clicked
                className="text-xs"
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure to delete this category?"
                onConfirm={() => handleDeleteCategory(category._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  className="text-xs text-red-500"
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </Card>
        ))}
      </div>

      <AddCategoryModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default Category;
