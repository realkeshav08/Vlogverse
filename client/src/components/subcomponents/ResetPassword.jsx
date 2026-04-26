import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import axios from "../../api/axios";

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [validToken, setValidToken] = useState(null);
    const [status, setStatus] = useState("Update Access Key");

    const { message: errorMessage, show: showErrorToast, showError } = useErrorToast();
    const { message: successMessage, show: showSuccessToast, showSuccess } = useSuccessToast();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`/auth/recovery/verify-token/${token}`);
                setValidToken(true);
            } catch (err) {
                setValidToken(false);
                showError("Invalid or expired reset link.");
            }
        };
        verifyToken();
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        
        if (!PASSWORD_REGEX.test(password)) {
            showError("Password must be 8-24 chars with uppercase, lowercase, number, and a special char (!@#$%).");
            return;
        }

        if (password !== confirmPassword) {
            showError("Keys do not match.");
            return;
        }

        setStatus("Updating...");
        try {
            const response = await axios.post(`/auth/recovery/reset-password/${token}`, { password });
            showSuccess(response.data.message);
            setStatus("Success!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to reset password.");
            setStatus("Update Access Key");
        }
    };

    if (validToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-10 text-center">
                <div className="max-w-md">
                    <h2 className="text-3xl font-black uppercase tracking-widest mb-6">Link Expired</h2>
                    <p className="text-white/40 mb-10">This password reset link is invalid or has already expired. Please request a new one.</p>
                    <Link to="/forgot-password" className="bg-primary px-10 py-5 font-black uppercase tracking-widest text-xs">Request New Link</Link>
                </div>
            </div>
        );
    }

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
                            <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-[0.3em] mb-8">New Key</h3>

                            <form className="flex flex-col gap-10" onSubmit={handleReset}>
                                <div className="group text-left">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] ml-1 mb-4 block group-focus-within:text-primary transition-colors">New Secret Key</label>
                                    <div className="relative">
                                        <input
                                            type={passwordType}
                                            placeholder="••••••••"
                                            className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-6 text-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                                        >
                                            {passwordType === "password" ? <IoMdEyeOff size={24} /> : <IoMdEye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group text-left">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] ml-1 mb-4 block group-focus-within:text-primary transition-colors">Confirm Key</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-6 text-lg text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "Updating..." || status === "Success!"}
                                    className="group relative w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-7 rounded-none transition-all duration-300 shadow-[25px_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.4em]">
                                        {status}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessToast message={successMessage} show={showSuccessToast} />
            <ErrorToast message={errorMessage} show={showErrorToast} />
        </div>
    );
};

export default ResetPassword;
