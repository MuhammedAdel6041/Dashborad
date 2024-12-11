import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import { AuthProvider } from "./context/AuthContext";

// Import Dashboard Pages
import Dashboard from "./pages/Dashboard";

import Analytics from "./pages/Analytics";
import Customers from "./pages/Customers";
import FlashSales from "./pages/FlashSales";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import User from "./pages/User";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    {/* Redirect /admin to /admin/dashboard */}
                    <Route path="/" element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="User" element={<User/>} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="flash-sales" element={<FlashSales />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
