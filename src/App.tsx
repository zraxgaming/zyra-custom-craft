
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

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

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";

// Contexts & Providers
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/cart/CartProvider";
import { WishlistProvider } from "./components/wishlist/WishlistProvider";

// Components
import { usePageTracking } from "./hooks/usePageTracking";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import PWANotifications from "./components/pwa/PWANotifications";
import PushNotificationManager from "./components/pwa/PushNotificationManager";
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-success/:orderId?" element={<OrderSuccess />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      </Routes>
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <PWANotifications />
      <PushNotificationManager />
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
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
