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
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Wishlist from "@/pages/Wishlist";
import Checkout from "@/pages/Checkout";
import GiftCards from "@/pages/GiftCards";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import Referrals from "@/pages/Referrals";
import Newsletter from "@/pages/Newsletter";
import NotFound from "@/pages/NotFound";
// FIX: ensure casing matches FILESYSTEM: should be 'Callback'
import AuthCallback from "@/pages/auth/Callback";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import ProductNew from "@/pages/admin/ProductNew";
import ProductEdit from "@/pages/admin/ProductEdit";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminInventory from "@/pages/admin/AdminInventory";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminGiftCards from "@/pages/admin/AdminGiftCards";
import AdminZiina from "@/pages/admin/AdminZiina";
import AdminScanner from "@/pages/admin/AdminScanner";
import AdminBarcodeScanner from "@/pages/admin/AdminBarcodeScanner";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import AdminBarcodes from "@/pages/admin/AdminBarcodes";
import AdminOrderDetails from "@/pages/admin/AdminOrderDetails";
import AdminOrderEdit from "@/pages/admin/ProductEdit";
import AdminProductDetails from "@/pages/admin/AdminProductDetails";
import OrderRefunds from "@/pages/admin/OrderRefunds";

import "./index.css";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="zyra-ui-theme">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div className="min-h-screen bg-background page-transition w-full">
                  <MaintenanceBanner />
                  <OnlineStatus />
                  
                  <Routes>
                    {/* Redirect root to home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Public Pages */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<Product />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    
                    {/* Auth Pages */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* User Dashboard - Fixed routing */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/account" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/referrals" element={<Referrals />} />
                    
                    {/* Shopping & Orders */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    
                    {/* Admin Routes - Fixed and comprehensive */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <AdminProducts />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products/new" element={
                      <AdminRoute>
                        <ProductNew />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products/:id/edit" element={
                      <AdminRoute>
                        <ProductEdit />
                      </AdminRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <AdminRoute>
                        <AdminCategories />
                      </AdminRoute>
                    } />
                    <Route path="/admin/coupons" element={
                      <AdminRoute>
                        <AdminCoupons />
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
                    <Route path="/admin/refunds" element={
                      <AdminRoute>
                        <OrderRefunds />
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
                    <Route path="/admin/barcode-scanner" element={
                      <AdminRoute>
                        <AdminBarcodeScanner />
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
                    <Route path="/admin/newsletter" element={
                      <AdminRoute>
                        <AdminNewsletter />
                      </AdminRoute>
                    } />
                    <Route path="/admin/barcodes" element={
                      <AdminRoute>
                        <AdminBarcodes />
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
