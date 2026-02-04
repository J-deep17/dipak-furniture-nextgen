import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight, Loader2, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);

    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/";

    // Form states
    const [emailData, setEmailData] = useState({ email: "", password: "" });
    const [phoneData, setPhoneData] = useState({ phoneNumber: "", otp: "" });

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post("/auth/login", emailData);
            login(res.data.token, res.data.user);
            toast({ title: "Welcome back!", description: "Successfully logged in." });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid credentials",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!phoneData.phoneNumber) return toast({ title: "Error", description: "Enter phone number" });
        setIsLoading(true);
        try {
            await api.post("/auth/send-otp", { phoneNumber: phoneData.phoneNumber });
            setOtpSent(true);
            setTimer(30);
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            toast({ title: "OTP Sent", description: "Please check your phone for the code." });
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to send OTP", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post("/auth/verify-otp", phoneData);
            login(res.data.token, res.data.user);
            toast({ title: "Welcome back!", description: "Successfully logged in." });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({ title: "Invalid OTP", description: "The code you entered is incorrect.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        toast({ title: "Google Login", description: "Redirecting to Google...", variant: "default" });

        // SIMULATED GOOGLE LOGIN FOR DEVELOPMENT
        // In production, use @react-oauth/google or Firebase Auth to get these details
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockGoogleUser = {
                googleId: "google-test-id-123",
                email: "testuser@gmail.com",
                name: "Test Google User",
                avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
            };

            const res = await api.post("/auth/google", mockGoogleUser);

            login(res.data.token, res.data.user);
            toast({ title: "Welcome!", description: "Successfully logged in with Google (Dev Mode)." });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                title: "Google Login Failed",
                description: error.response?.data?.message || "Failed to login with Google",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <h2 className="text-2xl font-bold text-slate-900">SteelShow Digital</h2>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your account</p>
                </div>

                <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="p-0">
                        <Tabs defaultValue="email" className="w-full">
                            <TabsList className="w-full h-14 rounded-none bg-slate-50 p-0 border-b">
                                <TabsTrigger value="email" className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all font-semibold">Email</TabsTrigger>
                                <TabsTrigger value="phone" className="flex-1 h-full rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all font-semibold">Phone OTP</TabsTrigger>
                            </TabsList>

                            <CardContent className="p-8">
                                <TabsContent value="email" className="mt-0 space-y-6">
                                    <form onSubmit={handleEmailLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-accent"
                                                    required
                                                    value={emailData.email}
                                                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <Link to="/forgot-password" title="Forgot Password" className="text-sm font-medium text-accent hover:underline">Forgot password?</Link>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-accent"
                                                    required
                                                    value={emailData.password}
                                                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black rounded-xl text-white font-bold" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="phone" className="mt-0 space-y-6">
                                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="+91 98XXX XXXXX"
                                                        className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-accent"
                                                        required
                                                        value={phoneData.phoneNumber}
                                                        onChange={(e) => setPhoneData({ ...phoneData, phoneNumber: e.target.value })}
                                                        disabled={otpSent}
                                                    />
                                                </div>
                                                {!otpSent && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="h-12 px-4 rounded-xl border-slate-200 font-semibold"
                                                        onClick={handleSendOTP}
                                                        disabled={isLoading}
                                                    >
                                                        Send OTP
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {otpSent && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="otp">Enter 6-digit OTP</Label>
                                                        <button
                                                            type="button"
                                                            onClick={handleSendOTP}
                                                            className={`text-sm font-medium ${timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-accent hover:underline"}`}
                                                            disabled={timer > 0 || isLoading}
                                                        >
                                                            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                                        </button>
                                                    </div>
                                                    <Input
                                                        id="otp"
                                                        maxLength={6}
                                                        placeholder="000000"
                                                        className="h-12 text-center text-xl tracking-[0.5em] font-bold rounded-xl border-slate-200 focus:ring-accent"
                                                        required
                                                        value={phoneData.otp}
                                                        onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black rounded-xl text-white font-bold" disabled={isLoading}>
                                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Login"}
                                                </Button>
                                                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-sm text-slate-500 hover:text-slate-700">Change Phone Number</button>
                                            </motion.div>
                                        )}
                                    </form>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </CardHeader>

                    <div className="px-8 pb-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-medium">Or continue with</span></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                            onClick={handleGoogleLogin}
                        >
                            <Chrome className="mr-2 h-5 w-5 text-blue-500" />
                            Sign in with Google
                        </Button>

                        <p className="text-center text-slate-500 text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" title="Signup" className="font-bold text-accent hover:underline">Create an account</Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
