import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsManager from "./pages/ProductsManager";
import OrdersManager from "./pages/OrdersManager";
import InventoryManager from "./pages/InventoryManager";
import AdminLayout from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const AdminRouter = () => {
    return (
        <Routes>
            <Route path="login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductsManager />} />
                    <Route path="orders" element={<OrdersManager />} />
                    <Route path="inventory" element={<InventoryManager />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    );
};

export default AdminRouter;
