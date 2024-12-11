import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
   
  TagsOutlined,
  UserOutlined,
  LineChartOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={200}
      theme="dark"
      style={{
        height: "100vh", // Full height
        position: "fixed", // Fix sidebar position
        top: 0,
        left: 0,
        background: "linear-gradient(to bottom, #121212, #1c1c2e, #4e3780)", // Gradient background
      }}
    >
      <div
        className="logo"
        style={{
          padding: "20px",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        Spodut
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{
          background: "transparent", // Transparent for gradient
        }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/admin/User">Users</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TagsOutlined />}>
          <Link to="/admin/flash-sales">Flash Sales</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
          <Link to="/admin/customers">Customers</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<LineChartOutlined />}>
          <Link to="/admin/analytics">Analytics</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<BellOutlined />}>
          <Link to="/admin/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<SettingOutlined />}>
          <Link to="/admin/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
