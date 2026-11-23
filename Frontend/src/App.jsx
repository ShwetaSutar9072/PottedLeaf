import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAuth, { NotAdmin } from "./components/RequireAuth.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import About from "./pages/About.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Feedback from "./pages/Feedback.jsx";
import Cart from "./pages/Cart.jsx";
import Payment from "./pages/Payment.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Catalog />} />
        <Route path="/plants" element={<Catalog category="Plants" />} />
        <Route path="/seeds" element={<Catalog category="Seeds" />} />
        <Route path="/fertilizers" element={<Catalog category="Fertilizers" />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<NotAdmin><Wishlist /></NotAdmin>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/cart" element={<NotAdmin><Cart /></NotAdmin>} />
        <Route path="/payment" element={<RequireAuth customer><Payment /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth customer><Orders /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth customer><Profile /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
