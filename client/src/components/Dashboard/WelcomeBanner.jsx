import React from 'react';
import useAuth from '../../auth/useAuth';

const WelcomeBanner = () => {
  const { auth } = useAuth();

  // Get time of day for greeting
  const date = new Date();
  const hrs = date.getHours();
  let greet;

  if (hrs < 12) greet = 'Good Morning';
  else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon';
  else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening';

  return (
    <div className="relative bg-white/[0.03] backdrop-blur-[30px] border border-white/10 p-10 overflow-hidden group hover:border-primary/40 transition-all duration-500">
      {/* Decorative Elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">System Online</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight mt-4">
            {greet},<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 group-hover:to-primary transition-all duration-500">
              {auth?.firstName || 'Explorer'}
            </span>
          </h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] mt-6 max-w-md leading-loose">
            Neural link established. Ready to synchronize your logs with the global verse.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
