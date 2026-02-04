import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    ClipboardList,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
        { name: "Inventory", path: "/admin/inventory", icon: ClipboardList },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 border-t-4 border-primary">
            {/* Sidebar */}
            <aside className={cn(
                "bg-white dark:bg-gray-800 border-r w-64 flex-shrink-0 transition-all duration-300",
                !isSidebarOpen && "w-20"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b">
                    {isSidebarOpen && <span className="font-bold text-xl uppercase tracking-tighter">Admin Panel</span>}
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                                location.pathname === item.path
                                    ? "bg-primary text-white"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                        >
                            <item.icon size={20} />
                            {isSidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-0 right-0 px-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="mr-3" />
                        {isSidebarOpen && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b flex items-center px-8 shadow-sm justify-between">
                    <h1 className="font-semibold text-lg">
                        {navItems.find(i => i.path === location.pathname)?.name || "Management"}
                    </h1>
                </header>
                <div className="flex-1 overflow-auto p-8 bg-gray-50 dark:bg-gray-900">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
