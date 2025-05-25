
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { AuthProvider } from "@/hooks/use-auth";
import SEOHead from "@/components/seo/SEOHead";
import { HelmetProvider } from "react-helmet-async";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { PWANotifications } from "@/components/pwa/PWANotifications";
import "./App.css";

// Lazy load components for better performance
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Auth = lazy(() => import("@/pages/Auth"));
const Account = lazy(() => import("@/pages/Account"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="zyra-ui-theme">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <TooltipProvider>
                  <Router>
                    <SEOHead />
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <PWAInstallPrompt />
                      <PWANotifications />
                      <Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      }>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/products/:slug" element={<ProductDetail />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/account" element={<Account />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                      <Toaster />
                    </div>
                  </Router>
                </TooltipProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
