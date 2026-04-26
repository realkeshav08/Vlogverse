import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../subcomponents/Loading';
import CreatePost from './CreatePost';
import PostBody from './PostBody';
import PostActions from './PostActions';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";
import DeletePost from './DeletePost';
import EditPost from './EditPost';
import { scroll } from 'framer-motion';

const Posts = ({ auth, POST_URL, setAuth, loading, currentPage, setCurrentPage, totalPages, fetchPosts, posts, setPosts }) => {
    const {
        message: errorMessage,
        show: showErrorToast,
        showError,
    } = useErrorToast();

    const {
        message: successMessage,
        show: showSuccessToast,
        showSuccess,
    } = useSuccessToast();

    const isImage = url => !isVideo(url); // fallback logic
    const isVideo = url => /\.(mp4|webm|ogg)$/i.test(url);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [auth?.accessToken, auth?.id, auth?.following, currentPage]);


    const canUserModifyPost = (post, auth) => {
        if (!auth || !post?.author) return false;

        const currentRole = auth.role;
        const postAuthorRole = post.author.role;

        if (post.author.username === auth.username) return true;

        const roleHierarchy = {
            user: 1,
            moderator: 2,
            admin: 3,
            owner: 4
        };

        return roleHierarchy[currentRole] > roleHierarchy[postAuthorRole];
    };


    return (
        <div className="mx-auto rounded-lg w-full">
            {
                loading
                    ?
                    <Loading />
                    :
                    (
                        <>
                            <CreatePost POST_URL={POST_URL} auth={auth} setAuth={setAuth} setPosts={setPosts} />

                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post._id} className="relative [&:not(:last-child)]:mb-10 bg-white/[0.03] backdrop-blur-[30px] border border-white/10 overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                        
                                        {/* Premium Header Strip */}
                                        <div className="h-1 bg-gradient-to-r from-primary/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="p-8">
                                            {canUserModifyPost(post, auth) && (
                                                <div className='absolute top-6 right-6 flex items-center gap-4 z-20'>
                                                    <EditPost
                                                        auth={auth}
                                                        post={post}
                                                        POST_URL={POST_URL}
                                                        showSuccess={showSuccess}
                                                        showError={showError}
                                                        setPosts={setPosts}
                                                        fetchPosts={fetchPosts}
                                                    />
                                                    <DeletePost
                                                        auth={auth}
                                                        setAuth={setAuth}
                                                        post={post}
                                                        POST_URL={POST_URL}
                                                        showSuccess={showSuccess}
                                                        showError={showError}
                                                        setPosts={setPosts}
                                                    />
                                                </div>
                                            )}

                                            {/* Author Info */}
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="relative">
                                                    <img
                                                        src={post.author.avatar}
                                                        alt="avatar"
                                                        className="w-14 h-14 rounded-none border border-white/20 p-1 bg-[#0a0a0c]"
                                                    />
                                                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 transition-all duration-500"></div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-white uppercase tracking-tighter text-lg leading-none">{post.author.firstName} {post.author.lastName}</p>
                                                    <Link
                                                        to={`/profile/${post.author.username}`}
                                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors mt-2 inline-block"
                                                    >
                                                        @{post.author.username}
                                                    </Link>
                                                </div>
                                                <div className="ml-auto text-[10px] font-bold uppercase tracking-widest text-white/20">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Post Body */}
                                            <div className="text-white/70 leading-relaxed font-medium">
                                                <PostBody body={post.body} />
                                            </div>

                                            {/* Media */}
                                            {post.media && (
                                                <div className="mt-8 space-y-4">
                                                    {/* Render Images */}
                                                    {Array.isArray(post.media.images) && post.media.images.length > 0 && (
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {post.media.images.filter(url => url && url.trim() !== "").map((url, index) => (
                                                                <div key={`image-${index}`} className="relative overflow-hidden border border-white/5 shadow-2xl">
                                                                    <img
                                                                        src={url}
                                                                        alt={`Post content ${index + 1}`}
                                                                        className="w-full h-auto max-h-[600px] object-cover hover:scale-[1.02] transition-transform duration-700"
                                                                        onError={(e) => e.target.style.display = 'none'}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Render Videos */}
                                                    {Array.isArray(post.media.videos) && post.media.videos.length > 0 && (
                                                        <div className="space-y-4">
                                                            {post.media.videos.filter(url => url && url.trim() !== "").map((url, index) => (
                                                                <div key={`video-${index}`} className="relative border border-white/5 bg-black overflow-hidden shadow-2xl">
                                                                    <video
                                                                        controls
                                                                        className="w-full max-h-[600px]"
                                                                    >
                                                                        <source src={url} />
                                                                    </video>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-3 mt-8">
                                                    {post.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-white/40 border border-white/5 hover:border-primary/40 hover:text-primary transition-all duration-300">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="h-[1px] bg-white/5 my-8"></div>

                                            <PostActions
                                                post={post}
                                                auth={auth}
                                                setPosts={setPosts}
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        </div>
                                    </div>
                                ))
                            )
                                :
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-center py-20">No Logs Detected in this Sector</p>
                            }
                        </>
                    )
            }


            {totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-20">
                    <div className="flex gap-2 bg-white/5 p-2 border border-white/10">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`w-12 h-12 flex items-center justify-center text-xs font-black transition-all duration-300 border ${
                                    currentPage === index + 1 
                                    ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' 
                                    : 'border-white/5 text-white/40 hover:border-white/20 hover:text-white hover:bg-white/5'
                                }`}
                                onClick={() => {
                                    setCurrentPage(index + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                {(index + 1).toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Toast Components */}
            <SuccessToast
                message={successMessage}
                show={showSuccessToast}
                status="success"
                icon={
                    <FaCheckCircle className="text-[--tertiary] text-2xl" />
                }
            />
            <ErrorToast
                message={errorMessage}
                show={showErrorToast}
                status="error"
                icon={<FaTimesCircle className="text-red-600 text-2xl" />}
                iconBgColor="bg-red-700"
            />
        </div >
    );
};

export default Posts;
