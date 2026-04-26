import { useState } from 'react'
import useAuth from '../../auth/useAuth'
import { Link } from 'react-router-dom';
import FollowModal from './FollowModal';

const UserInfo = () => {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState();

    const { auth } = useAuth();

    return (
        <div className="group bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-none overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all duration-500">
            {/* Animated Header Overlay */}
            <div className="h-32 bg-gradient-to-br from-primary/20 via-cyan-500/10 to-transparent w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/classy-bg.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <div className="px-8 pb-10 relative">
                {/* Avatar with Sharp Framing */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <Link to={'/profile/' + auth?.username} className="relative block group/avatar">
                        <div className="w-32 h-32 rounded-none border border-white/20 p-2 bg-[#0a0a0c] group-hover/avatar:border-primary transition-all duration-500 shadow-2xl">
                            <img
                                src={auth?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"}
                                alt="profile"
                                className="w-full h-full object-cover grayscale-[20%] group-hover/avatar:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="absolute inset-0 border-2 border-primary/0 group-hover/avatar:border-primary/50 -m-1 transition-all duration-500"></div>
                    </Link>
                </div>

                <div className="mt-20 text-center space-y-2">
                    <h2 className="font-black text-2xl uppercase tracking-tighter text-white">{auth?.firstName} {auth?.lastName}</h2>
                    <Link to={'/profile/' + auth?.username} className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-all duration-300">
                        Protocol: <span className="text-white/60">@{auth?.username}</span>
                    </Link>
                </div>

                <div className="h-[1px] bg-white/5 my-8"></div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="cursor-pointer hover:bg-white/5 p-4 transition-all duration-300 border border-transparent hover:border-white/5" onClick={() => {
                        setOpen(true);
                        setModalType('followers')
                    }}>
                        <div className="font-black text-xl text-white tracking-tighter">{auth?.followers?.length ?? 0}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Signals</div>
                    </div>
                    <div className="cursor-pointer hover:bg-white/5 p-4 transition-all duration-300 border border-transparent hover:border-white/5" onClick={() => {
                        setOpen(true);
                        setModalType('following')
                    }}>
                        <div className="font-black text-xl text-white tracking-tighter">{auth?.following?.length ?? 0}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Linked</div>
                    </div>
                    <div className="hover:bg-white/5 p-4 transition-all duration-300 border border-transparent hover:border-white/5">
                        <div className="font-black text-xl text-white tracking-tighter">{auth?.totalPosts?.length ?? 0}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Logs</div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FollowModal open={open} onClose={() => setOpen(false)} modalType={modalType} />
        </div>
    )
}

export default UserInfo