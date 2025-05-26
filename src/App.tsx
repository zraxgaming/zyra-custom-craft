
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import PushNotificationManager from "@/components/pwa/PushNotificationManager";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Account from "@/pages/Account";
import Profile from "@/pages/Profile";
import ProfileSettings from "@/pages/ProfileSettings";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import OrderTracking from "@/pages/OrderTracking";
import Wishlist from "@/pages/Wishlist";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminInventory from "@/pages/admin/Inventory";
import AdminOrders from "@/pages/admin/Orders";
import AdminOrderDetail from "@/pages/admin/OrderDetail";
import AdminCustomers from "@/pages/admin/Customers";
import AdminNewsletter from "@/pages/admin/Newsletter";
import AdminPromotions from "@/pages/admin/Promotions";
import AdminCoupons from "@/pages/admin/Coupons";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminBarcodes from "@/pages/admin/Barcodes";
import AdminScanner from "@/pages/admin/Scanner";
import AdminBarcodeScanner from "@/pages/admin/BarcodeScanner";
import AdminContact from "@/pages/admin/Contact";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminZiina from "@/pages/admin/Ziina";
import AdminSettings from "@/pages/admin/Settings";
import ProductEdit from "@/pages/admin/ProductEdit";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <CartProvider>
              <WishlistProvider>
                <BrowserRouter>
                  <GoogleAnalytics />
                  <PWAInstallPrompt />
                  <PushNotificationManager />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Navigate to="/auth" replace />} />
                    <Route path="/register" element={<Navigate to="/auth" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/account" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<ProfileSettings />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                    <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
                    <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                    <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
                    <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
                    <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
                    <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
                    <Route path="/admin/barcodes" element={<AdminRoute><AdminBarcodes /></AdminRoute>} />
                    <Route path="/admin/scanner" element={<AdminRoute><AdminScanner /></AdminRoute>} />
                    <Route path="/admin/barcode-scanner" element={<AdminRoute><AdminBarcodeScanner /></AdminRoute>} />
                    <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
                    <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
                    <Route path="/admin/ziina" element={<AdminRoute><AdminZiina /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                  <Sonner />
                </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
