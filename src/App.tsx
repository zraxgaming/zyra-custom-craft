
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/hooks/use-auth";
import EmailNotificationService from "@/components/notifications/EmailNotificationService";
import AdminRoute from "@/components/admin/AdminRoute";

// Public pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/auth/callback";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Categories from "./pages/Categories";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductEdit from "./pages/admin/ProductEdit";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Newsletter from "./pages/admin/Newsletter";
import Promotions from "./pages/admin/Promotions";
import ContactAdmin from "./pages/admin/Contact";
import GiftCards from "./pages/admin/GiftCards";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Coupons from "./pages/admin/Coupons";
import ZiinaStats from "./pages/admin/ZiinaStats";
import BarcodeManager from "./pages/admin/BarcodeManager";
import BarcodeScanner from "./pages/admin/BarcodeScanner";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="zyra-ui-theme">
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <EmailNotificationService />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/settings" element={<ProfileSettings />} />
                  <Route path="/account/orders" element={<Account />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
                  <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
                  <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
                  <Route path="/admin/newsletter" element={<AdminRoute><Newsletter /></AdminRoute>} />
                  <Route path="/admin/promotions" element={<AdminRoute><Promotions /></AdminRoute>} />
                  <Route path="/admin/contact" element={<AdminRoute><ContactAdmin /></AdminRoute>} />
                  <Route path="/admin/gift-cards" element={<AdminRoute><GiftCards /></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
                  <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
                  <Route path="/admin/ziina-stats" element={<AdminRoute><ZiinaStats /></AdminRoute>} />
                  <Route path="/admin/barcodes" element={<AdminRoute><BarcodeManager /></AdminRoute>} />
                  <Route path="/admin/scanner" element={<AdminRoute><BarcodeScanner /></AdminRoute>} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
