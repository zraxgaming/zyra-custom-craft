
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "next-themes";
import PWAInstallPrompt from "@/components/layout/PWAInstallPrompt";
import PushNotificationSetup from "@/components/layout/PushNotificationSetup";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/auth/callback";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import CategoryPage from "./pages/CategoryPage";
import GiftCards from "./pages/GiftCards";
import NotFound from "./pages/404";
import { WishlistProvider } from "@/hooks/use-wishlist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <MaintenanceBanner />
              <PWAInstallPrompt />
              <PushNotificationSetup />
              <BrowserRouter>
                <Routes>
                  {/* Always redirect "/" to "/home" */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  {/* Home page uses Index.tsx for actual homepage content */}
                  <Route path="/home" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/product-detail/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Profile />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/categories" element={<CategoryPage />} />
                  <Route path="/gift-cards" element={<GiftCards />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/order-failed" element={<OrderFailed />} />
                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
