
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/components/cart/CartProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import EmailNotificationService from "@/components/notifications/EmailNotificationService";
import PageTracker from "@/components/analytics/PageTracker";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import PushNotificationManager from "@/components/pwa/PushNotificationManager";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Dashboard from "@/pages/Dashboard";
import GiftCards from "@/pages/GiftCards";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderFailed from "@/pages/OrderFailed";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Referrals from "@/pages/Referrals";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <CartProvider>
              <PageTracker />
              <EmailNotificationService />
              <PushNotificationManager 
                enableAbandonedCart={true}
                enableOrderUpdates={true}
                enableStockAlerts={true}
                enablePromotions={true}
              />
              <PWAInstallPrompt />
              
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/gift-cards" element={<GiftCards />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/order-failed" element={<OrderFailed />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/referrals" element={<Referrals />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <CartDrawer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
