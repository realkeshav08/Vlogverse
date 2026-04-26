import React from 'react';
import { motion } from 'framer-motion';

const LoginSuccessSplash = ({ username }) => {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0c] font-outfit overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 text-center"
            >
                <h2 className="text-white/40 text-sm font-black uppercase tracking-[0.6em] mb-4"> Access Granted </h2>
                <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter">
                    Welcome, <span className="text-primary">{username}</span>
                </h1>
                <div className="mt-8 flex justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginSuccessSplash;
