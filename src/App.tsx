
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import ProductCustomizer from "./pages/ProductCustomizer";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import BarcodeManager from "./pages/admin/BarcodeManager";
import BarcodeScanner from "./pages/admin/BarcodeScanner";
import Newsletter from "./pages/admin/Newsletter";
import ProductEdit from "./pages/admin/ProductEdit";
import InventoryManager from "./components/admin/InventoryManager";
import PageAnalytics from "./components/admin/PageAnalytics";
import ZiinaIntegration from "./components/admin/ZiinaIntegration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            
            {/* Product Routes */}
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/customize/:productId" element={<ProductCustomizer />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/products/new" element={<ProductEdit />} />
            <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/inventory" element={
              <div className="min-h-screen bg-background">
                <div className="flex">
                  <div className="flex-1 overflow-auto">
                    <div className="p-6">
                      <InventoryManager />
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/admin/orders" element={<Dashboard />} />
            <Route path="/admin/customers" element={<Dashboard />} />
            <Route path="/admin/newsletter" element={<Newsletter />} />
            <Route path="/admin/promotions" element={<Dashboard />} />
            <Route path="/admin/coupons" element={<Dashboard />} />
            <Route path="/admin/gift-cards" element={<Dashboard />} />
            <Route path="/admin/barcodes" element={<BarcodeManager />} />
            <Route path="/admin/scanner" element={<BarcodeScanner />} />
            <Route path="/admin/contact" element={<Dashboard />} />
            <Route path="/admin/analytics" element={
              <div className="min-h-screen bg-background">
                <div className="flex">
                  <div className="flex-1 overflow-auto">
                    <div className="p-6">
                      <PageAnalytics />
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/admin/ziina" element={
              <div className="min-h-screen bg-background">
                <div className="flex">
                  <div className="flex-1 overflow-auto">
                    <div className="p-6">
                      <ZiinaIntegration />
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/admin/settings" element={<Dashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
