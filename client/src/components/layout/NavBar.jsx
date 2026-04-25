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
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-base-100 border-r border-base-200 p-4 z-50">
                <Link to="/" className="mb-10 px-4">
                    <h1 className="text-2xl font-bold font-inter tracking-tighter">Vlogverse</h1>
                </Link>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-base-200 ${isActive ? 'font-bold bg-base-200' : ''}`
                            }
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-lg">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Notifications Toggle */}
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-base-200 ${showNotifications ? 'bg-base-200' : ''}`}
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
                        <span className="text-lg">Notifications</span>
                    </button>
                </nav>

                {/* More Menu */}
                <div className="relative mt-auto" ref={moreMenuRef}>
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-base-200 transition-all"
                    >
                        <FaBars className="text-xl" />
                        <span className="text-lg">More</span>
                    </button>

                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full left-0 mb-2 w-full bg-base-200 rounded-2xl shadow-xl overflow-hidden p-2"
                            >
                                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-300 rounded-xl transition-all text-left">
                                    <IoSettingsSharp className="text-xl" />
                                    <span>Settings</span>
                                </button>
                                <div className="divider my-1 opacity-50"></div>
                                <label className="flex items-center justify-between px-4 py-3 hover:bg-base-300 rounded-xl cursor-pointer transition-all">
                                    <div className="flex items-center gap-3">
                                        {darkMode ? '🌙 Dark' : '☀️ Light'}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        className="toggle toggle-sm theme-controller"
                                        onChange={() => actions.toggleTheme()}
                                    />
                                </label>
                                <div className="divider my-1 opacity-50"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-300 rounded-xl transition-all text-error"
                                >
                                    <RiLogoutBoxLine className="text-xl" />
                                    <span>Logout</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden navbar bg-base-100 border-b border-base-200 sticky top-0 z-50 px-4">
                <div className="navbar-start">
                    <Link to="/" className="text-xl font-bold tracking-tighter">Vlogverse</Link>
                </div>
                <div className="navbar-end gap-2">
                    <button className="btn btn-ghost btn-circle" onClick={() => setShowNotifications(!showNotifications)}>
                        <div className="indicator">
                            {notifications?.some(n => !n.read) ? (
                                <>
                                    <IoNotificationsSharp className="text-xl text-primary" />
                                    <span className="badge badge-xs badge-primary indicator-item"></span>
                                </>
                            ) : (
                                <IoNotificationsOutline className="text-xl" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="lg:hidden btm-nav btm-nav-md bg-base-100 border-t border-base-200 z-50 h-16">
                {navItems.filter(i => i.label !== 'Search').map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => isActive ? 'active bg-base-200' : ''}
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed left-0 top-0 h-full w-80 md:w-96 bg-base-100 shadow-2xl z-[70] p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">Notifications</h2>
                                <button onClick={() => setShowNotifications(false)} className="btn btn-ghost btn-circle">✕</button>
                            </div>

                            <div className="space-y-4">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div key={n._id} className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${!n.read ? 'bg-primary/5 border border-primary/10' : 'bg-base-200/50'}`}>
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={n.from?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">{n.message}</p>
                                                {!n.read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(n._id)}
                                                        className="text-xs text-primary font-bold mt-1 hover:underline"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-base-content/50 py-10">No new notifications</p>
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