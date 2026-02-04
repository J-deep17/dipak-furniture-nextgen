import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
        }

        setIsLoading(true);
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            setIsSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to reset password", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
                    <p className="text-slate-500 mt-2">Create a new secure password for your account.</p>
                </div>

                <Card className="border-none shadow-xl rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-10">
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 h-12 rounded-xl" required value={password} onChange={e => setPassword(e.target.value)} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 bg-slate-900 rounded-xl font-bold" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Update Password"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Password Updated</h3>
                                    <p className="text-slate-500">Your password has been reset successfully. Redirecting to login...</p>
                                </div>
                                <Link to="/login" title="Login" className="inline-block text-accent font-bold hover:underline">Log in now</Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
