import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { FaTimesCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";

// REGEX for validation
const NAME_REGEX = /^[a-zA-Z][a-zA-Z- ]{1,50}$/;
const USERNAME_REGEX = /^[a-z0-9-]{5,30}$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordMatch: "",
  });

  const { message: errorMessage, show: showErrorToast, showError } = useErrorToast();
  const { message: successMessage, show: showSuccessToast, showSuccess } = useSuccessToast();

  const firstNameRef = useRef();
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validMatchingPassword, setValidMatchingPassword] = useState(false);

  const [passwordType, setPasswordType] = useState("password");
  const [success, setSuccess] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [buttonStatus, setButtonStatus] = useState("Launch Verse");

  // Stats state
  const [stats, setStats] = useState({ users: 0, communities: 0 });

  useEffect(() => { 
    firstNameRef.current?.focus(); 
    
    // Fetch stats
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

  useEffect(() => { setValidFirstName(NAME_REGEX.test(formData.firstName)); }, [formData.firstName]);
  useEffect(() => { setValidLastName(NAME_REGEX.test(formData.lastName)); }, [formData.lastName]);
  useEffect(() => { setValidUsername(USERNAME_REGEX.test(formData.username)); }, [formData.username]);
  useEffect(() => { setValidEmail(EMAIL_REGEX.test(formData.email)); }, [formData.email]);
  
  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(formData.password));
    setValidMatchingPassword(formData.password === formData.passwordMatch);
  }, [formData.password, formData.passwordMatch]);

  useEffect(() => {
    if (!usernameFocus || !formData.username) return;
    const handler = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/users/username/${formData.username}`);
        if (response.data) setUsernameAvailable(false);
      } catch (error) {
        if (error.response?.status === 404) setUsernameAvailable(true);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [formData.username, usernameFocus]);

  useEffect(() => {
    if (!emailFocus || !formData.email) return;
    const handler = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/users/email/${formData.email}`);
        if (response.data) setEmailAvailable(false);
      } catch (error) {
        if (error.response?.status === 404) setEmailAvailable(true);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [formData.email, emailFocus]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setButtonStatus("Initializing...");

    if (!validFirstName || !validLastName || !validUsername || !validEmail || !validPassword || !validMatchingPassword) {
      showError("Please check the form for errors");
      setButtonStatus("Launch Verse");
      return;
    }

    try {
      const { passwordMatch, ...submitData } = formData;
      await axios.post(REGISTER_URL, submitData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      showSuccess("Account Created!");
      setTimeout(() => setSuccess(true), 1500);
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    } finally {
      setButtonStatus("Launch Verse");
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
        <div className="absolute inset-0 bg-[#0a0a0c]/85 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] animate-fade">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 lg:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          
          <div className="text-center mb-10">
            <h1 className="font-pacifico text-6xl text-white mb-4">Vlogverse</h1>
            <p className="text-slate-500 font-bold text-xs tracking-[0.2em] uppercase mb-6">Claim Your Digital Identity</p>
            
            <div className="flex items-center justify-center gap-8 py-4 border-y border-white/5 bg-white/[0.02] rounded-2xl">
               <div className="flex flex-col">
                  <span className="text-xl font-black text-white">{(stats?.users || 0).toLocaleString()}+</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Members</span>
               </div>
               <div className="w-[1px] h-6 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-xl font-black text-white">{(stats?.communities || 0).toLocaleString()}+</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Verses</span>
               </div>
            </div>
          </div>

          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30">
                <FaCheckCircle className="text-4xl text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">You're Ready.</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">Your personal verse is now active. Join the global conversation.</p>
              <Link to="/login" className="w-full inline-block bg-primary hover:bg-primary/90 text-white py-4.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-primary/20">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  ref={firstNameRef}
                  onChange={handleChange}
                  id="firstName"
                  placeholder="First Name"
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                  required
                  value={formData.firstName}
                />
                <input
                  onChange={handleChange}
                  id="lastName"
                  placeholder="Last Name"
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                  required
                  value={formData.lastName}
                />
              </div>

              <div className="relative">
                <input
                  onChange={handleChange}
                  id="email"
                  type="email"
                  placeholder="Email Endpoint"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                  required
                  value={formData.email}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                {emailFocus && formData.email && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {validEmail && emailAvailable ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  onChange={handleChange}
                  id="username"
                  placeholder="Unique Handle"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                  required
                  value={formData.username}
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                />
                {usernameFocus && formData.username && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {validUsername && usernameAvailable ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    onChange={handleChange}
                    id="password"
                    type={passwordType}
                    placeholder="Secret Key"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                    required
                    value={formData.password}
                  />
                </div>
                <input
                  onChange={handleChange}
                  id="passwordMatch"
                  type="password"
                  placeholder="Verify Key"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                  required
                  value={formData.passwordMatch}
                />
              </div>

              <button
                type="submit"
                disabled={buttonStatus === "Initializing..."}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-4.5 rounded-2xl mt-2 transition-all duration-300 text-sm shadow-xl shadow-primary/20 tracking-widest uppercase"
              >
                {buttonStatus}
              </button>
              
              <p className="text-center text-sm text-slate-500 font-medium">
                Already have a handle? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="relative mt-12 py-12 w-full text-center z-10">
        <p className="text-slate-500 text-[11px] font-medium tracking-widest uppercase opacity-40">
          Designed and Developed by <span className="text-slate-300 font-bold">© Keshav Kashyap</span>
        </p>
      </div>

      <SuccessToast message={successMessage} show={showSuccessToast} />
      <ErrorToast message={errorMessage} show={showErrorToast} />
    </div>
  );
};

export default Register;
