
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AdminRoute from "@/components/admin/AdminRoute";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import GiftCards from "./pages/GiftCards";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminReviews from "./pages/admin/Reviews";
import AdminSettings from "./pages/admin/Settings";
import AdminNewsletter from "./pages/admin/Newsletter";
import AdminBarcodes from "./pages/admin/Barcodes";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminGiftCards from "./pages/admin/GiftCards";
import ProductEdit from "./pages/admin/ProductEdit";
import Scanner from "./pages/admin/Scanner";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <TooltipProvider>
                  <MaintenanceBanner />
                  <Toaster />
                  <Sonner />
                  <Routes>
                    {/* Root redirect to home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Main pages */}
                    <Route path="/home" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/order-success/:orderId?" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
                    <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
                    <Route path="/admin/barcodes" element={<AdminRoute><AdminBarcodes /></AdminRoute>} />
                    <Route path="/admin/scanner" element={<AdminRoute><Scanner /></AdminRoute>} />
                    <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
                    <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
                  </Routes>
                </TooltipProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
