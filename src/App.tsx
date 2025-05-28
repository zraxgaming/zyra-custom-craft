
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Layout components
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
import SEOHead from "@/components/seo/SEOHead";

// Public pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/NotFound";
import GiftCards from "@/pages/GiftCards";
import Referrals from "@/pages/Referrals";

// Admin pages
import AdminRoute from "@/components/admin/AdminRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminOrderDetails from "@/pages/admin/AdminOrderDetails";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminGiftCards from "@/pages/admin/AdminGiftCards";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminInventory from "@/pages/admin/AdminInventory";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import AdminTraffic from "@/pages/admin/AdminTraffic";
import AdminBarcodes from "@/pages/admin/AdminBarcodes";
import AdminBarcodeScanner from "@/pages/admin/AdminBarcodeScanner";
import AdminContact from "@/pages/admin/AdminContact";
import AdminZiina from "@/pages/admin/AdminZiina";
import AdminZiinaStats from "@/pages/admin/AdminZiinaStats";
import ProductNew from "@/pages/admin/ProductNew";
import ProductEdit from "@/pages/admin/ProductEdit";
import AuthCallback from "@/pages/auth/callback";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <BrowserRouter>
                <SEOHead />
                <MaintenanceBanner />
                <Routes>
                  {/* Redirect root to home */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  
                  {/* Public routes */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/gift-cards" element={<GiftCards />} />
                  <Route path="/referrals" element={<Referrals />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/products/new" element={<AdminRoute><ProductNew /></AdminRoute>} />
                  <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
                  <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
                  <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
                  <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
                  <Route path="/admin/newsletter" element={<AdminRoute><AdminNewsletter /></AdminRoute>} />
                  <Route path="/admin/traffic" element={<AdminRoute><AdminTraffic /></AdminRoute>} />
                  <Route path="/admin/barcodes" element={<AdminRoute><AdminBarcodes /></AdminRoute>} />
                  <Route path="/admin/scanner" element={<AdminRoute><AdminBarcodeScanner /></AdminRoute>} />
                  <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />
                  <Route path="/admin/ziina" element={<AdminRoute><AdminZiina /></AdminRoute>} />
                  <Route path="/admin/ziina-stats" element={<AdminRoute><AdminZiinaStats /></AdminRoute>} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
