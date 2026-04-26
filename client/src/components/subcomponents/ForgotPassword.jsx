import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("Send Recovery Link");
    const { message: errorMessage, show: showErrorToast, showError } = useErrorToast();
    const { message: successMessage, show: showSuccessToast, showSuccess } = useSuccessToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Processing...");
        try {
            const response = await axios.post("/auth/recovery/forgot-password", { email });
            showSuccess(response.data.message);
            setStatus("Link Sent");
        } catch (err) {
            showError(err.response?.data?.message || "Something went wrong. Please try again.");
            setStatus("Send Recovery Link");
        }
    };

    return (
        <div className="min-h-screen w-full font-outfit relative flex flex-col overflow-x-hidden bg-[#0a0a0c]">
            <div
                className="absolute inset-0 z-0 bg-[#0a0a0c]"
                style={{
                    backgroundImage: 'url("/images/classy-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'scroll',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/95 via-[#0a0a0c]/60 to-[#0a0a0c]/95 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
                <div className="w-full max-w-lg animate-fade-in-up">
                    <div className="bg-black/60 backdrop-blur-[40px] border border-white/20 p-12 lg:p-16 rounded-none shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl lg:text-5xl font-pacifico text-white mb-6">Vlogverse</h2>
                            <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-[0.3em] mb-8">Recovery</h3>
                            
                            <p className="text-white/40 text-sm mb-12 leading-relaxed">
                                Enter your digital mail below and we'll send you a secure link to reset your access key.
                            </p>

                            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                                <div className="group text-left">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] ml-1 mb-4 block group-focus-within:text-primary transition-colors">Digital Mail</label>
                                    <input
                                        type="email"
                                        placeholder="your@verse.com"
                                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-6 text-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "Processing..." || status === "Link Sent"}
                                    className="group relative w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-7 rounded-none transition-all duration-300 shadow-[25px_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.4em]">
                                        {status}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </form>

                            <div className="mt-10">
                                <Link to="/login" className="text-sm text-white/40 font-medium hover:text-primary transition-colors">
                                    Back to <span className="font-bold border-b border-primary/20">Sign In</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessToast message={successMessage} show={showSuccessToast} />
            <ErrorToast message={errorMessage} show={showErrorToast} />
        </div>
    );
};

export default ForgotPassword;
