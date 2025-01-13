import { Layout, Input, Badge, Avatar, Dropdown, Menu, message } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import Notification from "./notification"; // Import Notification Component

const { Header } = Layout;

const Topbar = () => {
  const { logout } = useAuth();

  // Menu for avatar dropdown
  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
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
      {/* Search Input */}
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        style={{ width: 200, marginLeft: 20 }}
      />

      {/* Right Section */}
      <div style={{ marginRight: 20, display: "flex", alignItems: "center" }}>
        {/* Notification Dropdown */}
        <Dropdown
          overlay={<Notification />}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge count={4} style={{ cursor: "pointer" }}>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
        </Dropdown>

        {/* Avatar Dropdown */}
        <Dropdown overlay={avatarMenu} trigger={["click"]}>
          <Avatar style={{ marginLeft: 20, cursor: "pointer" }}>A</Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
