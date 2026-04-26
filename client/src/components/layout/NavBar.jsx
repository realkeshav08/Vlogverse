import { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Link } from 'react-router-dom'
import useLogout from "../../auth/useLogout";
import { motion, AnimatePresence } from 'framer-motion'

// Icon Imports
import { IoMdHome } from "react-icons/io";
import { HiNewspaper } from "react-icons/hi2";
import { IoMdPeople } from "react-icons/io";
import { GiSuitcase } from "react-icons/gi";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { IoSettingsSharp, IoNotificationsOutline, IoNotificationsSharp, IoSearchOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdCheck } from 'react-icons/md';

// Context Imports
import ThemeContext from "../../context/ThemeContext";
import { axiosPrivate } from "../../api/axios";
import useAuth from "../../auth/useAuth";
import { useSocket } from "../../context/SocketContext";

const NavBar = ({ avatar, username, notifications }) => {
    const { auth, setAuth } = useAuth();
    const { darkMode, actions } = useContext(ThemeContext)
    const profileURL = `/profile/${username}`;
    const logout = useLogout();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const notificationRef = useRef(null);
    const moreMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axiosPrivate.patch(`/system/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${auth?.accessToken}` }
            });
            setAuth(prev => ({
                ...prev,
                notifications: prev.notifications.map(n =>
                    n._id === notificationId ? { ...n, read: true } : n
                )
            }));
        } catch (err) {
            console.error("Failed to mark notification as read.", err);
        }
    }

    const socket = useSocket();
    useEffect(() => {
        const handleNewNotification = (noti) => {
            setAuth(prev => ({ ...prev, notifications: [noti, ...prev.notifications] }));
        };
        if (socket) {
            socket.on('new-notification', handleNewNotification);
        }
        return () => {
            if (socket) socket.off('new-notification', handleNewNotification);
        };
    }, [socket]);

    const navItems = [
        { to: '/dashboard', icon: <IoMdHome />, label: 'Home' },
        { to: '/search', icon: <IoSearchOutline />, label: 'Search' },
        { to: '/blogs', icon: <HiNewspaper />, label: 'Blogs' },
        { to: '/network', icon: <IoMdPeople />, label: 'Network' },
        { to: '/jobs', icon: <GiSuitcase />, label: 'Jobs' },
        { to: profileURL, icon: <img src={avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"} className="w-6 h-6 rounded-full" />, label: 'Profile' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 bg-white/[0.02] backdrop-blur-[30px] border-r border-white/10 p-6 z-50 shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
                <Link to="/" className="mb-12 px-2 group">
                    <h1 className="text-3xl font-black tracking-tighter uppercase">
                        Vlog<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 group-hover:to-primary transition-all duration-500">verse</span>
                    </h1>
                </Link>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-none transition-all duration-300 border-l-2 ${isActive 
                                    ? 'border-primary bg-white/5 text-white font-black' 
                                    : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.03]'}`
                            }
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-base font-bold uppercase tracking-widest">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Notifications Toggle */}
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-none transition-all duration-300 border-l-2 border-transparent text-white/40 hover:text-white hover:bg-white/[0.03] ${showNotifications ? 'bg-white/5 text-white border-primary' : ''}`}
                    >
                        <div className="indicator">
                            {notifications?.some(n => !n.read) ? (
                                <>
                                    <IoNotificationsSharp className="text-2xl text-primary" />
                                    <span className="badge badge-xs badge-primary indicator-item"></span>
                                </>
                            ) : (
                                <IoNotificationsOutline className="text-2xl" />
                            )}
                        </div>
                        <span className="text-base font-bold uppercase tracking-widest">Notifications</span>
                    </button>
                </nav>

                {/* More Menu */}
                <div className="relative mt-auto" ref={moreMenuRef}>
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-full flex items-center gap-4 px-5 py-5 border-t border-white/5 hover:bg-white/5 transition-all text-white/40 hover:text-white"
                    >
                        <FaBars className="text-xl" />
                        <span className="text-base font-bold uppercase tracking-widest">System</span>
                    </button>

                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full left-0 mb-4 ml-4 w-64 bg-[#0f0f12] border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2 z-[60]"
                            >
                                <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 text-white/60 hover:text-white transition-all text-left text-xs font-bold uppercase tracking-widest">
                                    <IoSettingsSharp className="text-xl" />
                                    <span>Settings</span>
                                </button>
                                <div className="h-[1px] bg-white/5 my-1"></div>
                                <label className="flex items-center justify-between px-4 py-4 hover:bg-white/5 cursor-pointer transition-all">
                                    <div className="flex items-center gap-4 text-white/60 text-xs font-bold uppercase tracking-widest">
                                        {darkMode ? '🌙 Dark Protocol' : '☀️ Light Protocol'}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        className="toggle toggle-primary toggle-sm"
                                        onChange={() => actions.toggleTheme()}
                                    />
                                </label>
                                <div className="h-[1px] bg-white/5 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-4 py-4 hover:bg-red-500/10 text-red-500 transition-all text-xs font-bold uppercase tracking-widest"
                                >
                                    <RiLogoutBoxLine className="text-xl" />
                                    <span>Terminate Session</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden navbar bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 px-6 h-20">
                <div className="navbar-start">
                    <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
                        Vlog<span className="text-primary">verse</span>
                    </Link>
                </div>
                <div className="navbar-end gap-4">
                    <button className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                        <IoNotificationsOutline size={28} className="text-white/60" />
                        {notifications?.some(n => !n.read) && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#0a0a0c]"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden btm-nav btm-nav-md bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/5 z-50 h-20">
                {navItems.filter(i => i.label !== 'Search').map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => isActive ? 'text-primary bg-white/5' : 'text-white/40'}
                    >
                        <span className="text-2xl">{item.icon}</span>
                    </NavLink>
                ))}
            </div>

            {/* Notifications Drawer Overlay */}
            <AnimatePresence>
                {showNotifications && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNotifications(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed left-0 top-0 h-full w-full md:w-[450px] bg-[#0a0a0c] border-r border-white/10 shadow-[50px_0_100px_rgba(0,0,0,0.5)] z-[70] p-10 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Notifications</h2>
                                <button onClick={() => setShowNotifications(false)} className="text-white/20 hover:text-white transition-colors">
                                    <span className="text-4xl font-light">×</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div key={n._id} className={`p-6 rounded-none border-l-2 transition-all ${!n.read ? 'bg-white/5 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/[0.02] border-white/10 opacity-60'}`}>
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <img 
                                                        src={n.from?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"} 
                                                        className="w-12 h-12 rounded-none border border-white/10"
                                                    />
                                                    {!n.read && <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-[#0a0a0c]"></div>}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white/80 leading-relaxed">{n.message}</p>
                                                    {!n.read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(n._id)}
                                                            className="text-[10px] font-black uppercase tracking-widest text-primary mt-3 hover:underline"
                                                        >
                                                            Mark as Acknowledged
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                        <IoNotificationsOutline size={80} />
                                        <p className="text-xs font-black uppercase tracking-[0.4em] mt-8 text-center">System Clear<br/>No Incoming Signals</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavBar;