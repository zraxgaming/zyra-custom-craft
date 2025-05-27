
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AdminRoute from "@/components/admin/AdminRoute";

// Main Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Offline from "./pages/Offline";
import Newsletter from "./pages/Newsletter";
import GiftCards from "./pages/GiftCards";
import Referrals from "./pages/Referrals";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminZiina from "./pages/admin/AdminZiina";
import AdminTraffic from "./pages/admin/AdminTraffic";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import ZiinaStats from "./pages/admin/ZiinaStats";
import OrderView from "./pages/admin/OrderView";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Redirect root to /home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/referrals" element={<Referrals />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/order-success/:orderId?" element={<Success />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/offline" element={<Offline />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
                    <Route path="/admin/orders/:id" element={<AdminRoute><OrderView /></AdminRoute>} />
                    <Route path="/admin/ziina" element={<AdminRoute><AdminZiina /></AdminRoute>} />
                    <Route path="/admin/ziina-stats" element={<AdminRoute><ZiinaStats /></AdminRoute>} />
                    <Route path="/admin/traffic" element={<AdminRoute><AdminTraffic /></AdminRoute>} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
