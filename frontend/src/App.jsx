import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ServiceDetail from "./pages/ServiceDetail";
import Bookings from "./pages/Bookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";

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