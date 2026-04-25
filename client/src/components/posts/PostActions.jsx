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
        <div className="mt-4 border-t border-base-200 pt-3">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between text-base-content/70">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 transition-colors hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
                    >
                        {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                        <span>{post.likes.length}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 transition-colors hover:text-primary"
                    >
                        <FaRegComment className="text-xl" />
                        <span>{post.comments.length}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 transition-colors hover:text-blue-500"
                    >
                        <FaShare className="text-xl" />
                    </button>
                </div>

                <button className="transition-colors hover:text-yellow-500">
                    <FaRegBookmark className="text-xl" />
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className="mt-4 animate-fade-in-down">

                    {/* Comment List (Preview last 3) */}
                    <div className="space-y-3 mb-4">
                        {post.comments.slice(-3).map((comment, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-sm">
                                <span className="font-bold whitespace-nowrap">{comment.author?.username || "User"}:</span>
                                <p className="text-base-content/80 text-left">{comment.text}</p>
                            </div>
                        ))}
                        {post.comments.length > 3 && (
                            <p className="text-xs text-base-content/50 italic">View all {post.comments.length} comments...</p>
                        )}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            className="input input-sm w-full rounded-full"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-sm btn-primary btn-circle"
                            disabled={loading || !commentText.trim()}
                        >
                            {loading ? <span className="loading loading-spinner loading-xs"></span> : "➤"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostActions;
