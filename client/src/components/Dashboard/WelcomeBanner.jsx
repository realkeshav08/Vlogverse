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
    <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl p-6 shadow-lg mb-6 transform hover:scale-[1.01] transition-all duration-300">
      <h1 className="text-3xl font-bold mb-2">
        {greet}, {auth?.firstName || 'User'}! 👋
      </h1>
      <p className="opacity-90 text-lg">
        Ready to share what's on your mind today?
      </p>
    </div>
  );
};

export default WelcomeBanner;
