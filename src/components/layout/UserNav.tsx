import { Link } from "react-router-dom";
import { User, LogOut, LayoutDashboard, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export const UserNav = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <Link to="/login" title="Login" className="h-12 px-4 flex items-center justify-center bg-accent text-white transition-all hover:bg-accent/90 rounded-xl font-bold gap-2">
                <User size={18} />
                <span className="hidden sm:inline">Sign In</span>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative h-12 w-12 flex items-center justify-center bg-gray-100 text-foreground transition-all hover:bg-accent/10 hover:text-accent group rounded-xl">
                    <UserCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(user.role === 'superadmin' || user.role === 'editor') && (
                    <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer flex items-center text-primary font-bold">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
