import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import { AuthProvider } from "./context/AuthContext";

// Import Dashboard Pages
import Dashboard from "./pages/Dashboard";

 
 
import FlashSales from "./pages/FlashSales";
 
 
import User from "./pages/User";
import Prouducts from "./pages/Prouducts";
 
import Category from "./pages/Category";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import Brand from "./pages/Brand";
import Coupon from "./pages/Coupon";

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
                    <Route path="Profile" element={<Profile/>} />
                    <Route path="Category" element={<Category />} />
                    <Route path="product" element={<Prouducts />} />
                    <Route path="flash-sales" element={<FlashSales />} />
                    <Route path="brand" element={<Brand />} />
                    <Route path="coupon" element={<Coupon />} />
                    <Route path="order" element={<Order />} />
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
