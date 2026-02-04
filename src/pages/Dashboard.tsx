import { useState } from "react";
import { User, Package, Heart, MapPin, LogOut, Settings, ChevronRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login to view dashboard.</p>
            </div>
        );
    }

    const menuItems = [
        { id: "profile", label: "Profile Information", icon: UserCircle },
        { id: "orders", label: "Order History", icon: Package },
        { id: "wishlist", label: "My Wishlist", icon: Heart, link: "/wishlist" },
        { id: "addresses", label: "Saved Addresses", icon: MapPin },
        { id: "settings", label: "Account Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-80 space-y-4">
                        <Card className="border-none shadow-md overflow-hidden rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{user.name}</h2>
                                        <p className="text-sm text-slate-500">{user.role}</p>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        item.link ? (
                                            <Link key={item.id} to={item.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={20} />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                <ChevronRight size={16} />
                                            </Link>
                                        ) : (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === item.id ? "bg-accent text-white" : "hover:bg-slate-50 text-slate-600"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={20} />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                <ChevronRight size={16} />
                                            </button>
                                        )
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-4"
                                    >
                                        <LogOut size={20} />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "profile" && (
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-sm text-slate-400">Full Name</label>
                                                <p className="font-semibold text-lg">{user.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-slate-400">Email Address</label>
                                                <p className="font-semibold text-lg">{user.email}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-slate-400">Phone Number</label>
                                                <p className="font-semibold text-lg">{user.phoneNumber || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-slate-200">Edit Profile</Button>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "orders" && (
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
                                    <CardContent className="flex flex-col items-center py-12">
                                        <Package size={48} className="text-slate-200 mb-4" />
                                        <h3 className="text-lg font-bold">No orders yet</h3>
                                        <p className="text-slate-500 mb-6">Looks like you haven't placed any orders.</p>
                                        <Button asChild className="bg-slate-900 rounded-xl"><Link to="/products">Start Shopping</Link></Button>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "addresses" && (
                                <Card className="border-none shadow-md rounded-2xl">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Saved Addresses</CardTitle>
                                        <Button variant="outline" size="sm" className="rounded-xl">Add New</Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 border rounded-xl bg-slate-50 flex items-start gap-4">
                                            <MapPin className="text-accent mt-1" />
                                            <div>
                                                <p className="font-bold">Home <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded ml-2 uppercase">Default</span></p>
                                                <p className="text-slate-600 text-sm mt-1">123 Premium Lane, Luxury Block, Ahmedabad, Gujarat - 380001</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
