import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ServiceDetail from "./pages/ServiceDetail";
import Bookings from "./pages/Bookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderServices from "./pages/ProviderServices";
import ProviderRequests from "./pages/ProviderRequests";
import ProviderProfile from "./pages/ProviderProfile";
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
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/provider/services" element={<ProviderServices />} />
        <Route path="/provider/requests" element={<ProviderRequests />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Route>

      {/* Provider pages: sidebar */}
      <Route element={<DashboardLayout role="provider" />}>
        <Route path="/provider" element={<ProviderDashboard />} />
      </Route>

      {/* Admin pages: sidebar */}
      <Route element={<DashboardLayout role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;