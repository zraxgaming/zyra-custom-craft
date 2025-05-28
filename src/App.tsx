
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import AdminRoute from "@/components/admin/AdminRoute";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
import OnlineStatus from "@/components/layout/OnlineStatus";

// Pages
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Wishlist from "@/pages/Wishlist";
import Account from "@/pages/Account";
import Checkout from "@/pages/Checkout";
import GiftCards from "@/pages/GiftCards";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import Referrals from "@/pages/Referrals";
import Newsletter from "@/pages/Newsletter";
import NotFound from "@/pages/404";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminInventory from "@/pages/admin/Inventory";
import AdminOrders from "@/pages/admin/Orders";
import AdminUsers from "@/pages/admin/Users";
import AdminGiftCards from "@/pages/admin/GiftCards";
import AdminZiina from "@/pages/admin/AdminZiina";
import AdminScanner from "@/pages/admin/Scanner";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminSettings from "@/pages/admin/Settings";

import "./index.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="zyra-ui-theme">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <MaintenanceBanner />
                  <OnlineStatus />
                  
                  <Routes>
                    {/* Redirect root to home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Public Pages */}
                    <Route path="/index" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<Product />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    
                    {/* Auth Pages */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* User Dashboard & Account */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/referrals" element={<Referrals />} />
                    
                    {/* Shopping & Orders */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <AdminProducts />
                      </AdminRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <AdminRoute>
                        <AdminCategories />
                      </AdminRoute>
                    } />
                    <Route path="/admin/inventory" element={
                      <AdminRoute>
                        <AdminInventory />
                      </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <AdminRoute>
                        <AdminOrders />
                      </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminRoute>
                        <AdminUsers />
                      </AdminRoute>
                    } />
                    <Route path="/admin/gift-cards" element={
                      <AdminRoute>
                        <AdminGiftCards />
                      </AdminRoute>
                    } />
                    <Route path="/admin/ziina" element={
                      <AdminRoute>
                        <AdminZiina />
                      </AdminRoute>
                    } />
                    <Route path="/admin/scanner" element={
                      <AdminRoute>
                        <AdminScanner />
                      </AdminRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <AdminRoute>
                        <AdminAnalytics />
                      </AdminRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <AdminRoute>
                        <AdminSettings />
                      </AdminRoute>
                    } />
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  <Toaster />
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
