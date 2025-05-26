
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import EmailNotificationService from "@/components/notifications/EmailNotificationService";
import PageTracker from "@/components/analytics/PageTracker";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import PushNotificationManager from "@/components/pwa/PushNotificationManager";
import AdminRoute from "@/components/admin/AdminRoute";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import Products from "@/pages/Products";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Dashboard from "@/pages/Dashboard";
import GiftCards from "@/pages/GiftCards";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Referrals from "@/pages/Referrals";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomers from "@/pages/admin/Customers";
import AdminSettings from "@/pages/admin/Settings";
import AdminNewsletter from "@/pages/admin/Newsletter";
import AdminPromotions from "@/pages/admin/Promotions";
import AdminCoupons from "@/pages/admin/Coupons";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminBarcodes from "@/pages/admin/Barcodes";
import AdminScanner from "@/pages/admin/Scanner";
import AdminContact from "@/pages/admin/Contact";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminZiina from "@/pages/admin/Ziina";
import AdminInventory from "@/pages/admin/Inventory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <PageTracker />
                <EmailNotificationService />
                <PushNotificationManager 
                  enableAbandonedCart={true}
                  enableOrderUpdates={true}
                  enableStockAlerts={true}
                  enablePromotions={true}
                />
                <PWAInstallPrompt />
                
                <div className="min-h-screen bg-background">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/referrals" element={<Referrals />} />
                    
                    {/* Protected Routes */}
                    <Route path="/account" element={<Account />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
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
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CartDrawer />
                </div>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
