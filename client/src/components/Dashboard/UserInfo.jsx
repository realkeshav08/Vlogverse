import { useState } from 'react'
import useAuth from '../../auth/useAuth'
import { Link } from 'react-router-dom';
import FollowModal from './FollowModal';

const UserInfo = () => {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState();

    const { auth } = useAuth();

    return (
        <div className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-200">
            {/* Decorative Header (Cover) */}
            <div className="h-24 bg-gradient-to-r from-primary/80 to-secondary/80 w-full relative">
            </div>

            <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <Link to={'/profile/' + auth?.username} className="avatar">
                        <div className="w-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2 hover:scale-105 transition-transform duration-300 shadow-lg">
                            <img
                                src={auth?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"}
                                alt="profile"
                            />
                        </div>
                    </Link>
                </div>

                <div className="mt-14 text-center space-y-1">
                    <h2 className="font-bold text-xl">{auth?.firstName} {auth?.lastName}</h2>
                    <Link to={'/profile/' + auth?.username} className="text-sm text-base-content/60 hover:text-primary transition">@{auth?.username}</Link>
                </div>

                <div className="divider my-4"></div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="cursor-pointer hover:bg-base-200 rounded-lg p-2 transition" onClick={() => {
                        setOpen(true);
                        setModalType('followers')
                    }}>
                        <div className="font-bold text-lg">{auth?.followers?.length ?? 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-60">Followers</div>
                    </div>
                    <div className="cursor-pointer hover:bg-base-200 rounded-lg p-2 transition" onClick={() => {
                        setOpen(true);
                        setModalType('following')
                    }}>
                        <div className="font-bold text-lg">{auth?.following?.length ?? 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-60">Following</div>
                    </div>
                    <div className="hover:bg-base-200 rounded-lg p-2 transition">
                        <div className="font-bold text-lg">{auth?.totalPosts?.length ?? 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-60">Posts</div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FollowModal open={open} onClose={() => setOpen(false)} modalType={modalType} />
        </div>
    )
}

export default UserInfo