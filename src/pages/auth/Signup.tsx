import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, Lock, User, Check, Loader2, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { toast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        let strength = 0;
        if (formData.password.length >= 8) strength++;
        if (/[A-Z]/.test(formData.password)) strength++;
        if (/[0-9]/.test(formData.password)) strength++;
        if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
        setPasswordStrength(strength);
    }, [formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast({ title: "Passwords mismatch", description: "Please ensure both passwords are the same.", variant: "destructive" });
        }
        if (passwordStrength < 2) {
            return toast({ title: "Weak Password", description: "Please use a stronger password.", variant: "destructive" });
        }

        setIsLoading(true);
        try {
            const res = await api.post("/auth/signup", formData);
            toast({ title: "Account Created!", description: res.data.message });
            navigate("/login");
        } catch (error: any) {
            toast({ title: "Signup Failed", description: error.response?.data?.message || "Something went wrong", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <h2 className="text-2xl font-bold text-slate-900">SteelShow Digital</h2>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join us to experience premium furniture</p>
                </div>

                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="name" placeholder="John Doe" className="pl-10 h-12 rounded-xl border-slate-200" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="phone" type="tel" placeholder="+91 98XXX XXXXX" className="pl-10 h-12 rounded-xl border-slate-200" required value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-12 rounded-xl border-slate-200" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 h-12 rounded-xl border-slate-200" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {/* Strength Meter */}
                                    <div className="flex gap-1 mt-2 px-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= passwordStrength ? (passwordStrength <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-slate-100")} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-400 px-1 font-medium">Use 8+ characters with uppercase & symbols</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl border-slate-200" required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black rounded-xl text-white font-bold text-lg mt-4" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Sign Up"}
                            </Button>
                        </form>

                        <div className="my-8 relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-medium">Or join with</span></div>
                        </div>

                        <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-semibold mb-6 hover:bg-slate-50" onClick={() => { }}>
                            <Chrome className="mr-2 h-5 w-5 text-blue-500" />
                            Sign up with Google
                        </Button>

                        <p className="text-center text-slate-500 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" title="Login" className="font-bold text-accent hover:underline">Log In</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Signup;
