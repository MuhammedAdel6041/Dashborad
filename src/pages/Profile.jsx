import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Descriptions,
  Button,
  Spin,
  Alert,
} from "antd";
import {
  LinkedinOutlined,
  TwitterOutlined,
  FacebookOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion"; // Importing Framer Motion
import { useAuth } from "../context/AuthContext";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Profile = () => {
   
  const { auth } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://e-commerce-api-v1-cdk5.onrender.com/api/v1/users/getme",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch admin data.");
        }
        const { data } = await response.json();
        setAdminData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      fetchAdminData();
    }
  }, [auth]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Make sure it takes the full height of the viewport
        }}
      >
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!adminData) {
    return null;
  }

  const { name, email, phone, role, active, createdAt } = adminData;
  const staticAddress = "1234 Main St, Addis Ababa, Ethiopia"; // Static address

  return (
    <Layout>
      <Header style={{ background: "transparent", textAlign: "center", padding: 0 }}></Header>
      <Content style={{ padding: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{ marginTop: "-80px", borderRadius: "10px" }}
            bodyStyle={{ padding: "20px" }}
          >
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6} lg={4}>
                <Avatar
                  size={128}
                  src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Profile"
                />
              </Col>
              <Col xs={24} sm={16} md={18} lg={20}>
                <Title level={2} style={{ marginBottom: 0 }}>
                  {name}
                </Title>
                <Paragraph type="secondary">
                  {role === "admin" ? "Administrator" : "Vendor"}  
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <Row gutter={16} style={{ marginTop: "20px" }}>
          {/* Personal Details Section */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card title="Personal Details" bordered>
                <Descriptions column={1}>
                  <Descriptions.Item label="Name">{name}</Descriptions.Item>
                  <Descriptions.Item label="Role">{role}</Descriptions.Item>
                  <Descriptions.Item label="Active Status">{active ? "Active" : "Inactive"}</Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {new Date(createdAt).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </motion.div>
          </Col>

          {/* Contact Information Section */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card title="Contact Information" bordered>
                <Descriptions column={1}>
                  <Descriptions.Item label="Email">{email}</Descriptions.Item>
                  <Descriptions.Item label="Phone Number">{phone}</Descriptions.Item>
                  <Descriptions.Item label="Address">{staticAddress}</Descriptions.Item>
                </Descriptions>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "20px" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button
              shape="circle"
              size="large"
              icon={<LinkedinOutlined />}
              href="#"
              target="_blank"
              style={{ margin: "0 10px", color: "#0077b5" }}
            />
            <Button
              shape="circle"
              size="large"
              icon={<TwitterOutlined />}
              href="#"
              target="_blank"
              style={{ margin: "0 10px", color: "#1DA1F2" }}
            />
            <Button
              shape="circle"
              size="large"
              icon={<FacebookOutlined />}
              href="#"
              target="_blank"
              style={{ margin: "0 10px", color: "#4267B2" }}
            />
            <Button
              shape="circle"
              size="large"
              icon={<YoutubeOutlined />}
              href="#"
              target="_blank"
              style={{ margin: "0 10px", color: "#FF0000" }}
            />
          </motion.div>
        </Row>
      </Content>
    </Layout>
  );
};

export default Profile;
