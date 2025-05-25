
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import TypeformFeedback from "@/components/feedback/TypeformFeedback";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import ProfileSettings from "./pages/ProfileSettings";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/auth/callback";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import GiftCards from "./pages/GiftCards";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AdminRoute from "./components/admin/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductEdit from "./pages/admin/ProductEdit";
import Customers from "./pages/admin/Customers";
import AdminCategories from "./pages/admin/Categories";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";
import PaymentMethodsSettings from "./pages/admin/settings/PaymentMethodsSettings";
import ShippingMethodsSettings from "./pages/admin/settings/ShippingMethodsSettings";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import ContactView from "./pages/admin/ContactView";
import Newsletter from "./pages/admin/Newsletter";
import Promotions from "./pages/admin/Promotions";
import BarcodeScanner from "./pages/admin/BarcodeScanner";
import Barcodes from "./pages/admin/Barcodes";
import BarcodeManager from "./pages/admin/BarcodeManager";
import ZiinaStats from "./pages/admin/ZiinaStats";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Create React query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <GoogleAnalytics />
              <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <CartDrawer />
                  <PWAInstallPrompt />
                  <TypeformFeedback />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/gift-cards" element={<GiftCards />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                    <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
                    <Route path="/admin/products/new" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                    <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                    <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                    <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
                    <Route path="/admin/settings/payment-methods" element={<AdminRoute><PaymentMethodsSettings /></AdminRoute>} />
                    <Route path="/admin/settings/shipping-methods" element={<AdminRoute><ShippingMethodsSettings /></AdminRoute>} />
                    <Route path="/admin/contact" element={<AdminRoute><ContactSubmissions /></AdminRoute>} />
                    <Route path="/admin/contact/:id" element={<AdminRoute><ContactView /></AdminRoute>} />
                    <Route path="/admin/newsletter" element={<AdminRoute><Newsletter /></AdminRoute>} />
                    <Route path="/admin/promotions" element={<AdminRoute><Promotions /></AdminRoute>} />
                    <Route path="/admin/barcode-scanner" element={<AdminRoute><BarcodeScanner /></AdminRoute>} />
                    <Route path="/admin/barcodes" element={<AdminRoute><Barcodes /></AdminRoute>} />
                    <Route path="/admin/barcode-manager" element={<AdminRoute><BarcodeManager /></AdminRoute>} />
                    <Route path="/admin/ziina-stats" element={<AdminRoute><ZiinaStats /></AdminRoute>} />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </Suspense>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
