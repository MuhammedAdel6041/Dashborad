import { useEffect, useState } from "react";
import { List, Typography, Spin, message, Card, Button, Row, Col } from "antd";
import axios from "axios";

const { Text } = Typography;

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/reviews/?page=1&limit=3",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjViMjdhMTE0MjliYmZlOTBhNDIyMWQiLCJpYXQiOjE3MzY0NDU3NTYsImV4cCI6MTc0NDIyMTc1Nn0._0NSV384EwGKKXGyQT65FtJkyGc2uXD7tGg8vkUqN5w",
            },
          }
        );
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        message.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/reviews/${reviewId}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjViMjdhMTE0MjliYmZlOTBhNDIyMWQiLCJpYXQiOjE3MzY0NDU3NTYsImV4cCI6MTc0NDIyMTc1Nn0._0NSV384EwGKKXGyQT65FtJkyGc2uXD7tGg8vkUqN5w",
          },
        }
      );
      setNotifications((prev) => prev.filter((item) => item._id !== reviewId));
      message.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <Card
            key={item._id}
            style={{ marginBottom: "20px", border: "1px solid #f0f0f0" }}
            bodyStyle={{ padding: "20px" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={18}>
                <Text strong>{item.title}</Text>
                <br />
                <Text>Rating: {item.rating}</Text>
                <br />
                <Text>User: {item.user?.name || "Anonymous"}</Text>
                <br />
                <Text type="secondary">Created At: {new Date(item.createdAt).toLocaleString()}</Text>
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Button type="primary" style={{ marginBottom: "8px" }} block>
                  Accept
                </Button>
                <Button
                  type="primary"
                  danger
                  block
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Card>
        )}
      />
    </div>
  );
}
