import { Layout, Input, Avatar, Dropdown, Menu, message } from "antd";
import {
  SearchOutlined,
  UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Topbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Menu for avatar dropdown
  const avatarMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/admin/Profile")} // Update to match protected routes
      >
        Profile
      </Menu.Item>
      
      <Menu.Item key="logout" icon={<LogoutOutlined />} style={{ color: "red" }}>
        <button
          type="button"
          onClick={() => {
            logout();
            message.success("Logged out successfully!");
          }}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            color: "inherit",
          }}
        >
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        style={{ width: 200, marginLeft: 20 }}
      />

      <div style={{ marginRight: 20, display: "flex", alignItems: "center" }}>
        <Dropdown overlay={avatarMenu} trigger={["click"]}>
          <Avatar  src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3&q=80&w=1080" style={{ marginLeft: 20, cursor: "pointer" }}>A</Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
