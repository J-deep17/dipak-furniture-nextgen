import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("");
    const token = searchParams.get("token");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage("Missing verification token.");
                return;
            }
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(res.data.message);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || "Verification failed or token expired.");
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-accent" />
                        <h1 className="text-2xl font-bold">Verifying Email...</h1>
                        <p className="text-slate-500">Please wait while we confirm your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6">
                        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
                        <h1 className="text-3xl font-bold">Email Verified!</h1>
                        <p className="text-slate-600">{message}</p>
                        <Button asChild className="w-full h-12 bg-slate-900 rounded-xl mt-4">
                            <Link to="/login">Go to Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-6">
                        <XCircle className="h-20 w-20 text-red-500" />
                        <h1 className="text-3xl font-bold">Verification Failed</h1>
                        <p className="text-slate-600">{message}</p>
                        <Button asChild variant="outline" className="w-full h-12 rounded-xl border-slate-200 mt-4 font-bold">
                            <Link to="/signup">Back to Signup</Link>
                        </Button>
                        <Link to="/" className="text-sm text-slate-400 hover:underline">Back to Home</Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
