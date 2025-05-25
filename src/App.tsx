
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/hooks/use-auth";
import PWANotifications from "@/components/pwa/PWANotifications";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Newsletter from "./pages/admin/Newsletter";
import Promotions from "./pages/admin/Promotions";
import Barcodes from "./pages/admin/Barcodes";
import Scanner from "./pages/admin/Scanner";
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
                <PWANotifications />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/orders" element={<Account />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/admin/customers" element={<Customers />} />
                  <Route path="/admin/newsletter" element={<Newsletter />} />
                  <Route path="/admin/promotions" element={<Promotions />} />
                  <Route path="/admin/barcodes" element={<BarcodeManager />} />
                  <Route path="/admin/scanner" element={<BarcodeScanner />} />
                  <Route path="/admin/contact" element={<ContactAdmin />} />
                  <Route path="/admin/gift-cards" element={<GiftCards />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/admin/coupons" element={<Coupons />} />
                  <Route path="/admin/ziina-stats" element={<ZiinaStats />} />
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
