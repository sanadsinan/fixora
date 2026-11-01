import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

// Provider pages
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderServices from "./pages/ProviderServices";
import ProviderRequests from "./pages/ProviderRequests";
import ProviderProfile from "./pages/ProviderProfile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCategories from "./pages/AdminCategories";
import AdminBookings from "./pages/AdminBookings";
import AdminReviews from "./pages/AdminReviews";

function App() {
  return (
    <Routes>
      {/* Public pages: navbar + footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Provider pages: blue sidebar */}
      <Route element={<DashboardLayout role="provider" />}>
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider/services" element={<ProviderServices />} />
        <Route path="/provider/requests" element={<ProviderRequests />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
      </Route>

      {/* Admin pages: blue sidebar */}
      <Route element={<DashboardLayout role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  );
}

export default App;