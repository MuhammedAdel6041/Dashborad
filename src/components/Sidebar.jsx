import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
 
  ProductOutlined,
 
  CopyrightOutlined,
  BoldOutlined,
  AccountBookOutlined,
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
      
        <Menu.Item key="4" icon={<ProductOutlined />}>
          <Link to="/admin/product">Product</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<ProductOutlined />}>
          <Link to="/admin/order">Order</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<CopyrightOutlined />}>
          <Link to="/admin/Category">Category</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<BoldOutlined />}>
          <Link to="/admin/brand">Brand</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<AccountBookOutlined />}>
          <Link to="/admin/coupon">Coupon</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
