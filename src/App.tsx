
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductEdit from "./pages/admin/ProductEdit";
import AdminCategories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import ContactView from "./pages/admin/ContactView";
import Promotions from "./pages/admin/Promotions";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminRoute from "./components/admin/AdminRoute";
import Cart from "./pages/Cart";
import About from "./pages/About";
import AuthCallback from "./pages/auth/callback";
import Customers from "./pages/admin/Customers";

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
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div></div>}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <CartDrawer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Admin routes with protection */}
                <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
                <Route path="/admin/products/new" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductEdit /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
                <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetail /></AdminRoute>} />
                <Route path="/admin/contact" element={<AdminRoute><ContactSubmissions /></AdminRoute>} />
                <Route path="/admin/contact/:id" element={<AdminRoute><ContactView /></AdminRoute>} />
                <Route path="/admin/promotions" element={<AdminRoute><Promotions /></AdminRoute>} />
                <Route path="/admin/coupons" element={<AdminRoute><Coupons /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
