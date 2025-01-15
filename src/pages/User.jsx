// User.js
import { useState } from "react";
import { Table, Tag, Button, message, Popconfirm, Spin } from "antd";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AddUserModal from "../components/AddUserModal";
 
import { motion } from "framer-motion"; // Import motion
import moment from "moment"; // Import moment

// Fetch users from the API
const fetchUsers = async ({ queryKey }) => {
  const [, token] = queryKey; // Destructure token from queryKey
  const response = await axios.get(
    "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users",
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    }
  );
  return response.data.data; // Assuming users are in `data.data`
};

// Delete user API call
const deleteUser = async ({ id, token }) => {
  await axios.delete(
    `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    }
  );
};

const User = () => {
  const { auth } = useAuth(); // Access the token from AuthContext
  const queryClient = useQueryClient(); // React Query's QueryClient instance
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control Add User modal visibility
  

  // Fetch users with React Query
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", auth.token], // Pass token as part of the queryKey
    queryFn: fetchUsers,
    enabled: !!auth.token, // Only fetch if token is available
    onError: (error) => {
      console.error(error);
      message.error("Failed to fetch users. Please try again.");
    },
  });

  // Delete user mutation
  const mutation = useMutation({
    mutationFn: deleteUser, // Function to call for deletion
    onSuccess: () => {
      message.success("User deleted successfully!");
      // Refetch users to refresh the data or reload the page
      queryClient.invalidateQueries(["users"]);
      // window.location.reload(); // Uncomment this line if you want to reload the page instead
    },
    onError: (error) => {
      console.error(error);
      message.error("Failed to delete user. Please try again.");
    },
  });

  // Function to handle delete
  const handleDelete = (record) => {
    mutation.mutate({ id: record._id, token: auth.token });
  };

  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMMM Do YYYY, h:mm A"), // Format date
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
           
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record)} // Call handleDelete if confirmed
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              loading={mutation.isLoading && mutation.variables?.id === record._id} // Show loading for the specific user being deleted
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "blue";
      case "user":
        return "green";
      default:
        return "default";
    }
  };

  // Sort users by creation date (new to old)
  const sortedUsers = users ? [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)} // Open Add User modal
        >
          Add User
        </Button>
      </div>

      {isLoading ? ( // Show spinner if loading
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <motion.div
          initial={{ x: -100, opacity: 0 }} // Start from left with opacity 0
          animate={{ x: 0, opacity: 1 }} // Animate to position and full opacity
          exit={{ x: 100, opacity: 0 }} // Exit animation (slide out to the right)
          transition={{ duration: 0.5 }} // Transition duration
        >
          <Table
            columns={columns}
            dataSource={sortedUsers} // Use sorted users
            rowKey={(record) => record._id} // Use `_id` as the unique key
            pagination={{ pageSize: 10 }}
            bordered
          />
        </motion.div>
      )}

      <AddUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Close Add User modal
        onSuccess={refetch} // Refetch users after a successful add
        token={auth.token} // Pass token to modal for API request
      />

     
    </div>
  );
};

export default User;
