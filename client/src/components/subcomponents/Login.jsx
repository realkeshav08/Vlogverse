import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import axios from "../../api/axios";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import useAuth from "../../auth/useAuth";
import useRefreshToken from '../../auth/useRefreshToken'

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ login: "", password: "" });
  const loginRef = useRef();
  
  // Stats state with safe defaults
  const [stats, setStats] = useState({ users: 0, communities: 0 });

  const [passwordType, setPasswordType] = useState("password");
  const [buttonStatus, setButtonStatus] = useState("Sign In");

  // Hooks
  const { message: errorMessage, show: showErrorToast, showError } = useErrorToast();
  const { message: successMessage, show: showSuccessToast, showSuccess } = useSuccessToast();

  useEffect(() => { 
    loginRef.current?.focus(); 
    
    // Fetch stats on mount
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
      showSuccess(`Welcome back!`);
      setTimeout(async () => {
        setAuth({ login: formData.login, username: user.username, role: user.role, accessToken });
        await refresh();
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      showError(err.response?.data?.message || "Login Failed");
      setButtonStatus("Sign In");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] font-outfit relative flex items-center justify-center overflow-x-hidden py-12 px-6">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/images/abstract-bg.png" 
          alt="" 
          className="w-full h-full object-cover scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-[#0a0a0c]/60 to-[#0a0a0c]/90 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-16 xl:gap-24 animate-fade py-20">
        
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Public Beta v2.0</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-pacifico text-7xl lg:text-9xl text-white drop-shadow-2xl">Vlogverse</h1>
            <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              YOUR VOICE.<br/>
              YOUR VERSE.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#00d2ff]">EVERYONE'S</span> THOUGHTS.
            </h2>
          </div>

          <p className="text-lg lg:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed opacity-80">
            A global community for everyone to share thoughts, vlogs, and ideas. Connect with the world in real-time.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-8">
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white tracking-tighter">
                  {(stats?.users || 0).toLocaleString()}+
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Members</span>
             </div>
             <div className="w-[1px] h-10 bg-white/10 hidden sm:block"></div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white tracking-tighter">
                  {(stats?.communities || 0).toLocaleString()}+
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Communities</span>
             </div>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 p-10 lg:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-1">Sign In</h3>
                <p className="text-slate-500 text-sm">Access your personal workspace.</p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <input
                  ref={loginRef}
                  onChange={handleChange}
                  id="login"
                  type="text"
                  placeholder="Username or Email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  required
                  value={formData.login}
                />
                <div className="relative">
                  <input
                    onChange={handleChange}
                    id="password"
                    type={passwordType}
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                    required
                    value={formData.password}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {passwordType === "password" ? (
                      <IoMdEyeOff className="text-xl text-slate-500 cursor-pointer hover:text-slate-300" onClick={() => setPasswordType("text")} />
                    ) : (
                      <IoMdEye className="text-xl text-slate-500 cursor-pointer hover:text-slate-300" onClick={() => setPasswordType("password")} />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1 text-sm">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs border-white/20 bg-white/5 rounded-md"
                      onChange={() => setPersist(!persist)}
                      checked={persist}
                    />
                    Remember Me
                  </label>
                  <a href="#" className="text-primary font-bold hover:underline">Forgot?</a>
                </div>

                <button
                  type="submit"
                  disabled={buttonStatus === "Connecting..."}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl mt-4 transition-all duration-300 shadow-xl shadow-primary/20 h-14"
                >
                  {buttonStatus}
                </button>
                
                <div className="flex items-center gap-4 my-6">
                  <div className="h-[1px] bg-white/5 flex-1"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Collaborative Entry</span>
                  <div className="h-[1px] bg-white/5 flex-1"></div>
                </div>

                <button type="button" className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl text-sm transition-all h-13">
                  <FcGoogle className="text-xl" />
                  Sign in with Google
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  New to the verse? <Link to="/register" className="text-primary font-bold hover:underline">Join Now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto py-12 w-full text-center z-10">
        <p className="text-slate-500 text-[11px] font-medium tracking-widest uppercase opacity-40">
          Designed and Developed by <span className="text-slate-300 font-bold">© Keshav Kashyap</span>
        </p>
      </div>

      <SuccessToast message={successMessage} show={showSuccessToast} />
      <ErrorToast message={errorMessage} show={showErrorToast} />
    </div>
  );
};

export default Login;