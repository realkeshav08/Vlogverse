import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import axios from "../../api/axios";
import useAuth from "../../auth/useAuth";
import useRefreshToken from '../../auth/useRefreshToken'
import { useGoogleLogin } from '@react-oauth/google';

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";
import LoginSuccessSplash from "./LoginSuccessSplash";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ login: "", password: "" });
  const loginRef = useRef();
  
  const [stats, setStats] = useState({ users: 0, communities: 0 });
  const [passwordType, setPasswordType] = useState("password");
  const [buttonStatus, setButtonStatus] = useState("Sign In");

  const { message: errorMessage, show: showErrorToast, showError } = useErrorToast();
  const { message: successMessage, show: showSuccessToast, showSuccess } = useSuccessToast();
  const [welcomeUser, setWelcomeUser] = useState(null);

  useEffect(() => { 
    loginRef.current?.focus(); 
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        if (response.data) {
          setStats({
            users: response.data.users || 0,
            communities: response.data.communities || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonStatus("Connecting...");
    try {
      const response = await axios.post(LOGIN_URL, { ...formData, persist }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const { accessToken, user } = response.data;
      setWelcomeUser(user.firstName || user.username);
      setTimeout(() => {
        setAuth({ login: formData.login, username: user.username, role: user.role, accessToken });
        setWelcomeUser(null);
        navigate(from, { replace: true });
      }, 1500); // 1.5s to give it a bit of breath
    } catch (err) {
      console.error('Login attempt failed:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || (err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Network Error: Check your connection");
      showError(errorMessage);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setButtonStatus("Connecting...");
      try {
        const response = await axios.post("/auth/google", { 
          idToken: tokenResponse.access_token 
        });
        const { accessToken, user } = response.data;
        setWelcomeUser(user.firstName || user.username);
        setTimeout(() => {
          setAuth({ login: user.email, username: user.username, role: user.role, accessToken });
          setWelcomeUser(null);
          navigate(from, { replace: true });
        }, 1500);
      } catch (err) {
        showError("Google Sign-In failed. Please try again.");
        setButtonStatus("Sign In");
      }
    },
    onError: () => showError("Google Sign-In was unsuccessful.")
  });

  return (
    <>
      {welcomeUser && <LoginSuccessSplash username={welcomeUser} />}
      <div className="min-h-screen w-full font-outfit relative flex flex-col overflow-x-hidden bg-[#0a0a0c]">
      
      {/* Background Layer - Synchronized with Zoom */}
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
        {/* Deep atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/95 via-[#0a0a0c]/60 to-[#0a0a0c]/95 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-8 lg:px-12 py-12 lg:py-0 w-full mx-auto gap-12 xl:gap-32">
        
        {/* Left Side: Branding & Stats */}
        <div className="flex flex-col justify-center space-y-6 animate-fade-in-left w-full lg:w-auto text-center lg:text-left max-w-2xl">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-md bg-primary/20 border border-primary/30 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-content">Public Beta v2.0</span>
            </div>
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tighter leading-none m-0">Vlogverse</h1>
            <div className="space-y-1">
              <h2 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight uppercase">
                Your Voice.<br/>
                Your Verse.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Everyone's</span><br/>
                Thoughts.
              </h2>
            </div>
          </div>

          <p className="text-lg lg:text-xl text-white/60 max-w-xl font-medium leading-relaxed">
            A global community for everyone to share thoughts, vlogs, and ideas. Connect with the world in real-time.
          </p>

          <div className="flex items-center gap-12 pt-4">
             <div className="flex flex-col gap-1">
                <span className="text-3xl lg:text-5xl font-black text-white tracking-tighter">
                  {(stats?.users || 0)}
                </span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Active Members</span>
             </div>
             <div className="w-[1px] h-12 bg-white/10"></div>
             <div className="flex flex-col gap-1">
                <span className="text-3xl lg:text-5xl font-black text-white tracking-tighter">
                  {(stats?.communities || 0)}
                </span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Communities</span>
             </div>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="w-full lg:w-[600px] animate-fade-in-right">
          <div className="bg-black/60 backdrop-blur-[40px] border border-white/20 p-12 lg:p-20 rounded-none shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              {/* Form Header / Logo */}
              <div className="mb-12 text-center">
                <h3 className="text-2xl lg:text-3xl font-outfit font-black text-white uppercase tracking-[0.3em]">Sign In</h3>
              </div>

              <form className="flex flex-col gap-12" onSubmit={handleLogin}>
                <div className="flex flex-col gap-10">
                  <div className="group">
                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] ml-1 mb-4 block group-focus-within:text-primary transition-colors">Credential Handle</label>
                    <input
                      ref={loginRef}
                      onChange={handleChange}
                      id="login"
                      type="text"
                      placeholder="Username or Email"
                      className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                      required
                      value={formData.login}
                    />
                  </div>

                  <div className="group">
                    <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Access Key</label>
                    <div className="relative">
                      <input
                        onChange={handleChange}
                        id="password"
                        type={passwordType}
                        placeholder="Password"
                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                        required
                        value={formData.password}
                      />
                      <button 
                        type="button"
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                      >
                        {passwordType === "password" ? <IoMdEyeOff size={28} /> : <IoMdEye size={28} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1 text-base -mt-6">
                  <label className="flex items-center gap-5 text-white/40 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer h-7 w-7 appearance-none border border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer rounded-none"
                        checked={persist}
                        onChange={() => setPersist(prev => !prev)}
                      />
                      <svg className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs group-hover:text-white/60 transition-colors">Keep me signed in</span>
                  </label>
                  <Link to="/forgot-password" title="Forgot Password" className="text-primary font-black uppercase tracking-widest text-xs hover:text-primary/80 transition-all border-b-2 border-primary/20 hover:border-primary">
                    Recovery?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="group relative w-full bg-primary hover:bg-primary/90 text-white font-black py-8 rounded-none transition-all duration-300 shadow-[25px_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-5 text-lg uppercase tracking-[0.5em]">
                    Sign In
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                <div className="flex items-center gap-10 py-2">
                  <div className="h-[1px] bg-white/10 flex-1"></div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Alternative Protocol</span>
                  <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                <button 
                  type="button" 
                  onClick={() => handleGoogleLogin()}
                  className="flex items-center justify-center gap-5 w-full bg-white/[0.03] border border-white/20 hover:bg-white/[0.08] hover:border-white/40 text-white font-black py-6 rounded-none text-xs uppercase tracking-[0.2em] transition-all group"
                >
                  <FcGoogle className="text-3xl group-hover:scale-110 transition-transform" />
                  Continue with Google Network
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-white/40 font-medium">
                  New to the verse? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Join Now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Block - Centered */}
      <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-black/10 backdrop-blur-sm mt-auto">
        <div className="w-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
            Designed and Developed by <span className="text-white/60 font-black">© Keshav Kashyap</span>
          </p>
          <div className="flex items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>

      <SuccessToast message={successMessage} show={showSuccessToast} />
      <ErrorToast message={errorMessage} show={showErrorToast} />
      </div>
    </>
  );
};

export default Login;