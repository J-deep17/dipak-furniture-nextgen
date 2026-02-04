import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setSubmitted(true);
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Something went wrong", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
                    <p className="text-slate-500 mt-2">Enter your email and we'll send you a reset link.</p>
                </div>

                <Card className="border-none shadow-xl rounded-2xl bg-white overflow-hidden">
                    <CardContent className="p-10">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-12 rounded-xl" required value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 bg-slate-900 rounded-xl" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Send Reset Link"}
                                </Button>
                                <div className="text-center">
                                    <Link to="/login" className="text-sm font-semibold text-slate-500 flex items-center justify-center gap-2 hover:text-slate-800">
                                        <ArrowLeft size={16} /> Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Check your email</h3>
                                    <p className="text-slate-500">We've sent a password reset link to <span className="font-semibold text-slate-900">{email}</span></p>
                                </div>
                                <div className="pt-4">
                                    <Link to="/login" title="Login" className="text-accent font-bold hover:underline">Return to Log In</Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
