
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

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/Orders";
import AdminOrderDetails from "@/pages/admin/AdminOrderDetails";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminBranding from "@/pages/admin/AdminBranding";
import AdminCustomization from "@/pages/admin/AdminCustomization";
import AdminBackups from "@/pages/admin/AdminBackups";
import ZiinaStats from "@/pages/admin/ZiinaStats";

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
                  <Route path="/auth/callback" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/gift-cards" element={<AdminGiftCards />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/branding" element={<AdminBranding />} />
                  <Route path="/admin/customization" element={<AdminCustomization />} />
                  <Route path="/admin/backups" element={<AdminBackups />} />
                  <Route path="/admin/ziina-stats" element={<ZiinaStats />} />
                  
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
