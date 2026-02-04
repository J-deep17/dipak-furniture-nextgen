import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Package,
    Folders,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Truck,
    Image,
    Star,
    ClipboardList,
    ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Hero Banners', path: '/admin/hero-banners', icon: Image },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: Folders },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Inventory', path: '/admin/inventory', icon: ClipboardList },
        { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
        { name: 'Reviews', path: '/admin/reviews', icon: Star },
        { name: 'Delivery', path: '/admin/delivery', icon: Truck },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r shadow-sm transition-transform duration-300 transform",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0 md:static md:inset-auto md:w-64 md:shadow-none"
                )}
            >
                <div className="flex items-center justify-between p-4 h-16 border-b">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                location.pathname.startsWith(item.path)
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-0 right-0 p-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header for Mobile */}
                <header className="md:hidden h-16 flex items-center px-4 bg-white dark:bg-gray-800 border-b">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-4 font-semibold">Menu</span>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
