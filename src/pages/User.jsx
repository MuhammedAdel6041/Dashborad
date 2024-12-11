import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Tag, Button, message } from "antd";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Fetch users from the API
const fetchUsers = async ({ queryKey }) => {
  const [, token] = queryKey; // Destructure token from queryKey
  const response = await axios.get(
    "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users/?page=2&limit=50",
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
      queryClient.invalidateQueries(["users"]); // Invalidate cache to refetch users
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record)}
            loading={mutation.isLoading && mutation.variables?.id === record._id} // Show loading for the specific user being deleted
          >
            Delete
          </Button>
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

  // Placeholder function for handling edit
  const handleEdit = (record) => {
    console.log("Edit user:", record);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button type="primary" onClick={refetch}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey={(record) => record._id} // Use `_id` as the unique key
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default User;
