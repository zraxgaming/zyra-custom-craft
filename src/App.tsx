
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/hooks/use-theme";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import GiftCards from "@/pages/GiftCards";
import Auth from "@/pages/Auth";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProductNew from "@/pages/admin/ProductNew";
import AdminProductEdit from "@/pages/admin/ProductEdit";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/Users";
import AdminCategories from "@/pages/admin/Categories";
import AdminInventory from "@/pages/admin/Inventory";
import AdminScanner from "@/pages/admin/Scanner";
import AdminBarcodes from "@/pages/admin/Barcodes";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminSettings from "@/pages/admin/Settings";
import AdminZiina from "@/pages/admin/Ziina";

// Auth Components
import AuthPage from "@/components/auth/AuthPage";
import AuthCallback from "@/pages/auth/callback";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="zyra-theme">
        <AuthProvider>
          <CartProvider>
            <Router>
              <MaintenanceBanner />
              <Routes>
                {/* Redirect root to home */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                
                {/* Public Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />

                {/* Protected User Pages */}
                <Route path="/dashboard" element={
                  <AuthPage>
                    <Dashboard />
                  </AuthPage>
                } />
                <Route path="/profile" element={
                  <AuthPage>
                    <Profile />
                  </AuthPage>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AuthPage requireAuth={true}>
                    <AdminDashboard />
                  </AuthPage>
                } />
                <Route path="/admin/dashboard" element={
                  <AuthPage requireAuth={true}>
                    <AdminDashboard />
                  </AuthPage>
                } />
                <Route path="/admin/products" element={
                  <AuthPage requireAuth={true}>
                    <AdminProducts />
                  </AuthPage>
                } />
                <Route path="/admin/products/new" element={
                  <AuthPage requireAuth={true}>
                    <AdminProductNew />
                  </AuthPage>
                } />
                <Route path="/admin/products/edit/:id" element={
                  <AuthPage requireAuth={true}>
                    <AdminProductEdit />
                  </AuthPage>
                } />
                <Route path="/admin/orders" element={
                  <AuthPage requireAuth={true}>
                    <AdminOrders />
                  </AuthPage>
                } />
                <Route path="/admin/users" element={
                  <AuthPage requireAuth={true}>
                    <AdminUsers />
                  </AuthPage>
                } />
                <Route path="/admin/categories" element={
                  <AuthPage requireAuth={true}>
                    <AdminCategories />
                  </AuthPage>
                } />
                <Route path="/admin/inventory" element={
                  <AuthPage requireAuth={true}>
                    <AdminInventory />
                  </AuthPage>
                } />
                <Route path="/admin/scanner" element={
                  <AuthPage requireAuth={true}>
                    <AdminScanner />
                  </AuthPage>
                } />
                <Route path="/admin/barcodes" element={
                  <AuthPage requireAuth={true}>
                    <AdminBarcodes />
                  </AuthPage>
                } />
                <Route path="/admin/gift-cards" element={
                  <AuthPage requireAuth={true}>
                    <AdminGiftCards />
                  </AuthPage>
                } />
                <Route path="/admin/settings" element={
                  <AuthPage requireAuth={true}>
                    <AdminSettings />
                  </AuthPage>
                } />
                <Route path="/admin/ziina" element={
                  <AuthPage requireAuth={true}>
                    <AdminZiina />
                  </AuthPage>
                } />
              </Routes>
              <Toaster />
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
