import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Philosophy from "./pages/Philosophy";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Materials from "./pages/Materials";
import Quality from "./pages/Quality";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import CategoryList from "./pages/admin/CategoryList";
import OrderList from "./pages/admin/OrderList";
import EnquiryList from "./pages/admin/EnquiryList";
import DeliveryManager from "./pages/admin/DeliveryManager";
import HeroBannerList from "./pages/admin/HeroBannerList";
import Reviews from "./pages/admin/Reviews";
import Inventory from "./pages/admin/Inventory";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ProtectedRoute from "./admin/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:categorySlug" element={<ProductCategory />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/quality" element={<Quality />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={["superadmin", "editor"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="hero-banners" element={<HeroBannerList />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="enquiries" element={<EnquiryList />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="delivery" element={<DeliveryManager />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/order-success/:orderNumber" element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />


                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
