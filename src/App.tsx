
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { usePageTracking } from "@/hooks/usePageTracking";
import AdminRoute from "@/components/admin/AdminRoute";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ProductCustomizer from "./pages/ProductCustomizer";
import AuthPage from "./components/auth/AuthPage";
import AuthCallback from "./pages/auth/callback";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import CategoryPage from "./pages/CategoryPage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminNewsletter from "./pages/admin/Newsletter";
import AdminPromotions from "./pages/admin/Promotions";
import AdminCoupons from "./pages/admin/Coupons";
import AdminGiftCards from "./pages/admin/GiftCards";
import AdminBarcodes from "./pages/admin/Barcodes";
import AdminScanner from "./pages/admin/Scanner";
import AdminContact from "./pages/admin/Contact";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminZiina from "./pages/admin/Ziina";
import AdminSettings from "./pages/admin/Settings";
import AdminInventory from "./pages/admin/Inventory";
import ProductEdit from "./pages/admin/ProductEdit";
import OrderDetail from "./pages/admin/OrderDetail";

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  
  return (
    <Routes>
      {/* Redirect root to /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Public Routes */}
      <Route path="/home" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/customize/:productId" element={<ProductCustomizer />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/order-failed" element={<OrderFailed />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetail /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
      <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
      <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
      <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
      <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
      <Route path="/admin/barcodes" element={<AdminRoute><AdminBarcodes /></AdminRoute>} />
      <Route path="/admin/scanner" element={<AdminRoute><AdminScanner /></AdminRoute>} />
      <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/ziina" element={<AdminRoute><AdminZiina /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="zyra-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <div className="min-h-screen w-full">
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </div>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
