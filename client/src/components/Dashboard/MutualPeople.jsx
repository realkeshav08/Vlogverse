import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaUserFriends } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa6";
import Loading from '../subcomponents/Loading';
import { axiosPrivate } from '../../api/axios';
import { notificationTemplate } from '../../utils/notificationTemplate';

function Activity({ refreshPosts, auth, setAuth }) {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get('/api/users', {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`
          }
        });
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [auth?.accessToken]);

  const suggestedUsers = useMemo(() => {
    if (!auth || !auth.following || !users.length) return [];

    // Filter out users that is the current user and the user's following
    return [...users]
      .filter(user =>
        user._id !== auth.id &&
        !auth.following.includes(user._id)
      )
      // Randomizes filtered list and limits to 5 return
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [users]);


  return (
    <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-none overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/30">
            <FaUserFriends size={14} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Network Signals</h3>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loading />
            </div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user, i) => {
              const isFollowing = auth?.following.includes(user._id);

              const handleFollow = async () => {
                try {
                  const response = await axiosPrivate.post(`/api/users/follow/${user._id}`, {}, {
                    headers: { Authorization: `Bearer ${auth?.accessToken}` }
                  });

                  if (!isFollowing) {
                    setAuth(prev => ({
                      ...prev,
                      following: [...prev.following, user._id]
                    }));
                    const payload = notificationTemplate.follow(auth, user._id);
                    try {
                      await axiosPrivate.post('/system/notifications', payload, {
                        headers: { Authorization: `Bearer ${auth?.accessToken}` }
                      });
                      refreshPosts();
                    } catch (err) {
                      console.error('Failed to notify user:', err);
                    }
                  } else {
                    setAuth(prev => ({
                      ...prev,
                      following: prev.following.filter(id => id !== user._id)
                    }));
                    const payload = { type: 'follow', from: auth?.id, to: user._id };
                    try {
                      await axiosPrivate.delete('/system/notifications', {
                        headers: { Authorization: `Bearer ${auth?.accessToken}` },
                        data: payload
                      });
                      refreshPosts();
                    } catch (err) {
                      console.error('Failed to notify user:', err);
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
              };

              return (
                <div className="group/user relative p-4 bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all duration-300" key={user._id}>
                  <div className="flex items-center justify-between gap-4">
                    <Link to={`/profile/${user.username}`} className="flex items-center gap-4 group-hover/user:translate-x-1 transition-transform duration-300">
                      <img
                        src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"}
                        alt=""
                        className="w-12 h-12 rounded-none border border-white/10"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white/80 tracking-tighter uppercase">{user.firstName}</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">@{user.username}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => handleFollow()}
                      className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${isFollowing ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-white/5 text-white/40 border border-white/10 hover:border-primary hover:text-primary hover:bg-primary/10'}`}
                    >
                      {isFollowing ? <FaUserCheck size={16} /> : <IoPersonAddSharp size={16} />}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">
              No new signals detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activity
