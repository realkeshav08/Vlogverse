import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import useRefreshToken from "../../auth/useRefreshToken";

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";
import LoginSuccessSplash from "./LoginSuccessSplash";

// REGEX for validation
const NAME_REGEX = /^[a-zA-Z][a-zA-Z- ]{1,50}$/;
const USERNAME_REGEX = /^[a-z0-9-]{5,30}$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const refresh = useRefreshToken();
  const [welcomeUser, setWelcomeUser] = useState(null);
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
  const [stats, setStats] = useState({ users: 0, communities: 0 });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    firstNameRef.current?.focus();
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

    const errors = {};
    if (!validFirstName) errors.firstName = "Name must start with a letter and contain only letters, spaces, or hyphens.";
    if (!validLastName) errors.lastName = "Name must start with a letter and contain only letters, spaces, or hyphens.";
    if (!validUsername) errors.username = "Handle must be 5-30 characters (lowercase letters, numbers, hyphens only).";
    if (usernameAvailable === false) errors.username = "This handle is already taken.";
    if (!validEmail) errors.email = "Please enter a valid digital mail address.";
    if (emailAvailable === false) errors.email = "This digital mail is already in use.";
    if (!validPassword) errors.password = "Key must be 8-24 chars with uppercase, lowercase, number, and a special char (!@#$%).";
    if (!validMatchingPassword) errors.passwordMatch = "Keys do not match.";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      showError("Please correct the highlighted errors");
      setButtonStatus("Launch Verse");
      return;
    }

    try {
      const { passwordMatch, ...submitData } = formData;
      const response = await axios.post(REGISTER_URL, submitData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setWelcomeUser(formData.firstName);
      setTimeout(() => {
        setAuth({ login: formData.email, username: formData.username, role: 'user', accessToken: response.data.accessToken });
        setWelcomeUser(null);
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Registration attempt failed:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || (err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Network Error: Check your connection");
      showError(errorMessage);
    } finally {
      setButtonStatus("Launch Verse");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setButtonStatus("Initializing...");
      try {
        const response = await axios.post("/auth/google", { 
          idToken: tokenResponse.access_token 
        });
        const { accessToken, user } = response.data;
        setWelcomeUser(user.firstName || user.username);
        setTimeout(() => {
          setAuth({ login: user.email, username: user.username, role: user.role, accessToken });
          setWelcomeUser(null);
          navigate("/dashboard", { replace: true });
        }, 1500);
      } catch (err) {
        showError("Google Sign-In failed. Please try again.");
        setButtonStatus("Launch Verse");
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
                Claim Your<br />
                Digital<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Identity</span><br />
                Today.
              </h2>
            </div>
          </div>

          <p className="text-lg lg:text-xl text-white/60 max-w-xl font-medium leading-relaxed">
            Join a global community designed for creators and thinkers. Your journey into the verse starts here.
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

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-[680px] animate-fade-in-right">
          <div className="bg-black/60 backdrop-blur-[40px] border border-white/20 p-12 lg:p-20 rounded-none shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>

            <div className="relative z-10">
              {/* Form Header / Logo */}
              <div className="mb-12 text-center">
                <h2 className="text-5xl lg:text-6xl font-pacifico text-white mb-6 tracking-normal">Vlogverse</h2>
                <div className="h-[1px] w-16 bg-primary/30 mx-auto mb-6"></div>
                <h3 className="text-2xl lg:text-3xl font-outfit font-black text-white uppercase tracking-[0.3em]">Register</h3>
              </div>

              {success ? (
                <div className="text-center py-10 animate-fade">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30">
                    <FaCheckCircle className="text-4xl text-primary" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">You're Ready.</h2>
                  <p className="text-white/40 text-lg mb-10 leading-relaxed">Your account has been initialized. Welcome to the Vlogverse.</p>
                  <Link to="/login" className="w-full inline-block bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20">
                    Go to Sign In
                  </Link>
                </div>
              ) : (
                <form className="flex flex-col gap-12" onSubmit={handleRegister}>
                  <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="group">
                        <label className="text-xs font-black text-white/40 uppercase tracking-[0.3em] ml-1 mb-4 block group-focus-within:text-primary transition-colors">First Name</label>
                        <input
                          ref={firstNameRef}
                          onChange={handleChange}
                          id="firstName"
                          placeholder="Keshav"
                          className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                          required
                          value={formData.firstName}
                        />
                        {fieldErrors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.firstName}</p>}
                      </div>
                      <div className="group">
                        <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Last Name</label>
                        <input
                          onChange={handleChange}
                          id="lastName"
                          placeholder="Kashyap"
                          className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                          required
                          value={formData.lastName}
                        />
                        {fieldErrors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.lastName}</p>}
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Digital Mail</label>
                      <input
                        onChange={handleChange}
                        id="email"
                        type="email"
                        placeholder="your@verse.com"
                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                        required
                        value={formData.email}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                      {fieldErrors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.email}</p>}
                    </div>

                    <div className="group">
                      <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Unique Handle</label>
                      <input
                        onChange={handleChange}
                        id="username"
                        placeholder="vlog-warrior"
                        className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                        required
                        value={formData.username}
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                      />
                      {fieldErrors.username && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.username}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="group relative">
                        <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Secret Key</label>
                        <input
                          onChange={handleChange}
                          id="password"
                          type={passwordType}
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                          required
                          value={formData.password}
                        />
                        {fieldErrors.password && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.password}</p>}
                      </div>
                      <div className="group relative">
                        <label className="text-sm font-black text-white/50 uppercase tracking-[0.4em] ml-1 mb-5 block group-focus-within:text-primary transition-colors">Confirm Key</label>
                        <input
                          onChange={handleChange}
                          id="passwordMatch"
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-white/[0.03] border border-white/20 rounded-none px-8 py-7 text-xl text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
                          required
                          value={formData.passwordMatch}
                        />
                        {fieldErrors.passwordMatch && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-pulse">{fieldErrors.passwordMatch}</p>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={buttonStatus === "Initializing..."}
                    className="group relative w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-8 rounded-none transition-all duration-300 shadow-[25px_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden h-24 mt-2"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-5 text-lg uppercase tracking-[0.5em]">
                      {buttonStatus}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>

                  <div className="flex items-center gap-10 py-2 -mt-2">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <span className="text-xs font-black text-white/20 uppercase tracking-[0.6em]">Alternative Protocol</span>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleGoogleLogin()}
                    className="flex items-center justify-center gap-5 w-full bg-white/[0.03] border border-white/20 hover:bg-white/[0.08] hover:border-white/40 text-white font-black py-6 rounded-none text-xs uppercase tracking-[0.2em] transition-all group -mt-2"
                  >
                    <FcGoogle className="text-3xl group-hover:scale-110 transition-transform" />
                    Connect with Google Network
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-white/40 font-medium">
                  Already have a handle? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log In</Link>
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

export default Register;
