
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import NotFound from "./pages/404";
import Offline from "./pages/Offline";
import Newsletter from "./pages/Newsletter";
import GiftCards from "./pages/GiftCards";
import Referrals from "./pages/Referrals";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminZiina from "./pages/admin/AdminZiina";
import AdminTraffic from "./pages/admin/AdminTraffic";

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
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/ziina" element={<AdminZiina />} />
                    <Route path="/admin/traffic" element={<AdminTraffic />} />
                    <Route path="/offline" element={<Offline />} />
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
