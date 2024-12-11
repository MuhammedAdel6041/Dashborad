import { Layout, Input, Badge, Avatar, Dropdown, Menu, message } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access logout

const { Header } = Layout;

const Topbar = () => {
  const { logout } = useAuth(); // Access the logout function from the AuthContext

  // Menu for avatar dropdown
  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <button
          type="button"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          Profile
        </button>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <button
          type="button"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          Settings
        </button>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        style={{ color: "red" }} // Red color for logout
      >
        <button
          type="button"
          onClick={() => {
            logout(); // Call the logout function
            message.success("Logged out successfully!"); // Show a success message
          }}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            color: "inherit", // Inherit the red color from the parent Menu.Item
          }}
        >
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );

  // Menu for notifications dropdown
  const notificationMenu = (
    <Menu>
      <Menu.Item key="1">Notification 1</Menu.Item>
      <Menu.Item key="2">Notification 2</Menu.Item>
      <Menu.Item key="3">Notification 3</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">
        <button
          type="button"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          View All Notifications
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
        <Dropdown overlay={notificationMenu} trigger={["click"]}>
          <Badge count={5} style={{ cursor: "pointer" }}>
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
