import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCw } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("superadmin" | "editor" | "customer")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted url
        const redirectPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
        return <Navigate to={`${redirectPath}?redirect=${location.pathname}`} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Role not authorized
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
