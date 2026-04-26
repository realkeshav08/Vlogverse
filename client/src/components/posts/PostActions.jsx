import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { axiosPrivate } from '../../api/axios';

const PostActions = ({ post, auth, setPosts, showSuccess, showError }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);

    const isLiked = post.likes.includes(auth.id);
    // const isSaved = post.savedBy?.includes(auth.id); // Assuming saved functionality exists or will be added

    const handleLike = async () => {
        try {
            // Optimistic update
            setPosts(prevPosts => prevPosts.map(p => {
                if (p._id === post._id) {
                    const newLikes = isLiked
                        ? p.likes.filter(id => id !== auth.id)
                        : [...p.likes, auth.id];
                    return { ...p, likes: newLikes };
                }
                return p;
            }));

            await axiosPrivate.patch(`/api/posts/${post._id}/like`);
        } catch (err) {
            showError("Failed to update like status.");
            // Revert on error (could implement revert logic here)
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        showSuccess("Link copied to clipboard!");
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            const response = await axiosPrivate.post(`/api/posts/${post._id}/comments`, { text: commentText });
            setPosts(prevPosts => prevPosts.map(p => {
                if (p._id === post._id) {
                    return { ...p, comments: response.data.comments }; // Update with new comments
                }
                return p;
            }));
            setCommentText('');
        } catch (err) {
            showError("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border-t border-white/5 pt-6">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-3 transition-all duration-300 group/like ${isLiked ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className={`p-2 transition-all duration-300 ${isLiked ? 'bg-primary/20' : 'bg-white/5 group-hover/like:bg-white/10'}`}>
                            {isLiked ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{post.likes.length} SIGNAL</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-3 transition-all duration-300 group/comm ${showComments ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className={`p-2 transition-all duration-300 ${showComments ? 'bg-primary/20' : 'bg-white/5 group-hover/comm:bg-white/10'}`}>
                            <FaRegComment className="text-sm" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{post.comments.length} LOGS</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-3 transition-all duration-300 group/share text-white/40 hover:text-white"
                    >
                        <div className="p-2 bg-white/5 group-hover/share:bg-white/10 transition-all duration-300">
                            <FaShare className="text-sm" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">RELAY</span>
                    </button>
                </div>

                <button className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-yellow-500 transition-all duration-300">
                    <FaRegBookmark className="text-sm" />
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Comment List */}
                    <div className="space-y-4 mb-8">
                        {post.comments.length > 0 ? (
                            post.comments.slice(-5).map((comment, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-4 bg-white/[0.02] border border-white/5">
                                    <div className="w-1 h-8 bg-white/5 flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">@{comment.author?.username || "GUEST"}</span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 text-center py-4">Logs Empty</p>
                        )}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleComment} className="flex gap-4">
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="Neural entry..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-8 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/80 transition-all disabled:opacity-20"
                            disabled={loading || !commentText.trim()}
                        >
                            {loading ? "..." : "ENTRY"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostActions;
