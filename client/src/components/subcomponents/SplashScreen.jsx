import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0c] font-outfit overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo / Title Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none">
                        Vlog<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">verse</span>
                    </h1>
                </motion.div>

                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-12"
                >
                    <p className="text-white/40 text-sm font-black uppercase tracking-[0.8em] ml-2">
                        Welcome to the Future
                    </p>
                </motion.div>

                {/* Progress Indicator */}
                <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden mb-24">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                </div>
            </div>

            {/* Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-12 flex flex-col items-center gap-2 z-30"
            >
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                    Designed and Developed by
                </p>
                <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">
                    © Keshav Kashyap
                </p>
            </motion.div>

            {/* Scanning Line Effect */}
            <motion.div 
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent h-32 w-full z-20"
            />
        </div>
    );
};

export default SplashScreen;
