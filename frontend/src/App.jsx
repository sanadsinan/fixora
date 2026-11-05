import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

// Customer pages
import Bookings from "./pages/Bookings";
import BookingConfirmed from "./pages/BookingConfirmed";
import WriteReview from "./pages/WriteReview";
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
      {/* Pages with the navbar and footer */}
      <Route element={<MainLayout />}>
        {/* Anyone can open these */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Customers only */}
        <Route element={<ProtectedRoute roles={["customer"]} />}>
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/bookings/:id/review" element={<WriteReview />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Keep this last: any other address */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Providers only: blue sidebar */}
      <Route element={<ProtectedRoute roles={["provider"]} />}>
        <Route element={<DashboardLayout role="provider" />}>
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/provider/requests" element={<ProviderRequests />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
        </Route>
      </Route>

      {/* Admins only: blue sidebar */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;