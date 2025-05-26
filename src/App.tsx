
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import GiftCards from "./pages/GiftCards";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderView from "./pages/admin/OrderView";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminCategories from "./pages/admin/Categories";
import AdminCustomers from "./pages/admin/Customers";
import AdminContact from "./pages/admin/Contact";
import AdminContactSubmissions from "./pages/admin/ContactSubmissions";
import AdminContactView from "./pages/admin/ContactView";
import AdminCoupons from "./pages/admin/Coupons";
import AdminPromotions from "./pages/admin/Promotions";
import AdminNewsletter from "./pages/admin/Newsletter";
import AdminGiftCards from "./pages/admin/GiftCards";
import AdminInventory from "./pages/admin/Inventory";
import AdminBarcodes from "./pages/admin/Barcodes";
import AdminBarcodeScanner from "./pages/admin/BarcodeScanner";
import AdminScanner from "./pages/admin/Scanner";
import AdminZiina from "./pages/admin/Ziina";
import ProductEdit from "./pages/admin/ProductEdit";
import ProductNew from "./pages/admin/ProductNew";

// Contexts & Providers
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/cart/CartProvider";
import { WishlistProvider } from "./components/wishlist/WishlistProvider";

// Components
import { usePageTracking } from "./hooks/usePageTracking";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import SimplePWANotifications from "./components/pwa/SimplePWANotifications";
import ServiceWorkerUpdater from "./components/pwa/ServiceWorkerUpdater";
import NetworkStatus from "./components/pwa/NetworkStatus";
import SEOHead from "./components/seo/SEOHead";
import AdminRoute from "./components/admin/AdminRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  usePageTracking();
  
  return (
    <>
      <SEOHead />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/order-success/:orderId?" element={<OrderSuccess />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><ProductNew /></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderView /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
        <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
        <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
        <Route path="/admin/barcodes" element={<AdminRoute><AdminBarcodes /></AdminRoute>} />
        <Route path="/admin/scanner" element={<AdminRoute><AdminBarcodeScanner /></AdminRoute>} />
        <Route path="/admin/contact" element={<AdminRoute><AdminContactSubmissions /></AdminRoute>} />
        <Route path="/admin/contact/:id" element={<AdminRoute><AdminContactView /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/ziina" element={<AdminRoute><AdminZiina /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      </Routes>
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <SimplePWANotifications />
      <ServiceWorkerUpdater />
      <NetworkStatus />
      
      <Toaster />
      <Sonner />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="zyra-theme">
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
