
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import GiftCards from "@/pages/GiftCards";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminOrderDetails from "@/pages/admin/AdminOrderDetails";
import AdminCustomers from "@/pages/admin/Customers";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminSettings from "@/pages/admin/Settings";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminContactSubmissions from "@/pages/admin/AdminContactSubmissions";
import Coupons from "@/pages/admin/Coupons";
import Promotions from "@/pages/admin/Promotions";
import AdminZiina from "@/pages/admin/Ziina";
import NotFound from "@/components/NotFound";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="zyra-theme">
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-background w-full">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Protected User Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                <Route path="/account" element={<Navigate to="/dashboard" replace />} />
                <Route path="/wishlist" element={<Navigate to="/dashboard" replace />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/order-failed" element={<OrderFailed />} />

                {/* Redirect old auth routes */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />
                <Route path="/signup" element={<Navigate to="/auth" replace />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/gift-cards" element={<AdminGiftCards />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/contact" element={<AdminContactSubmissions />} />
                <Route path="/admin/promotions" element={<Promotions />} />
                <Route path="/admin/ziina" element={<AdminZiina />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
