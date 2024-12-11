/* eslint-disable react/prop-types */
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const { Content } = Layout;

const DashboardLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200 }}> {/* Adjust for the fixed sidebar */}
        <Topbar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "100vh", // Ensure content takes full height
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
