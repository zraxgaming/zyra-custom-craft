
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';

// Layout Components
import PromotionBanner from "@/components/layout/PromotionBanner";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import Contact from "@/pages/Contact";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import Profile from "@/pages/Profile";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderSuccess from "@/pages/OrderSuccess";
import About from "@/pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/components/NotFound";
import Products from "@/pages/Products";
import FAQ from "@/pages/FAQ";
import Newsletter from "@/pages/Newsletter";
import NewsletterUnsubscribe from "@/pages/NewsletterUnsubscribe";

// Auth
import EnhancedAuthPage from "@/components/auth/EnhancedAuthPage";

// Admin
import AdminRoute from "@/components/admin/AdminRoute";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminFAQ from "@/pages/admin/AdminFAQ";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <PromotionBanner />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/termsofservice" element={<TermsOfService />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth" element={<EnhancedAuthPage />} />
                    <Route path="/register" element={<EnhancedAuthPage />} />
                    
                    {/* User Routes */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/faq" element={<AdminRoute><AdminFAQ /></AdminRoute>} />
                    
                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
