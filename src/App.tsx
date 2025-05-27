import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/hooks/use-theme";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
import Auth from "@/pages/Auth";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminScanner from "@/pages/admin/Scanner";
import AdminBarcodes from "@/pages/admin/Barcodes";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminSettings from "@/pages/admin/Settings";
import AdminZiina from "@/pages/admin/Ziina";
import AuthPage from "@/components/auth/AuthPage";
import AuthCallback from "@/pages/auth/callback";
import AdminBarcodeScanner from "@/pages/admin/BarcodeScanner";

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
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                <Route path="/" element={<Shop />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />

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
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/dashboard" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/products" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/orders" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/users" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/scanner" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminScanner />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/barcode-scanner" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminBarcodeScanner />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/barcodes" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminBarcodes />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/gift-cards" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminGiftCards />
                    </AdminLayout>
                  </AuthPage>
                } />
                <Route path="/admin/settings" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </AuthPage>
                } />
                 <Route path="/admin/ziina" element={
                  <AuthPage requireAuth={true}>
                    <AdminLayout>
                      <AdminZiina />
                    </AdminLayout>
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
