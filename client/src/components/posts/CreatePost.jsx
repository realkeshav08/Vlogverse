import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../api/axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Toast imports
import ErrorToast from "../toast/ErrorToast";
import { useErrorToast } from "../toast/useErrorToast";
import SuccessToast from "../toast/SuccessToast";
import { useSuccessToast } from "../toast/useSuccessToast";

const CreatePost = ({ POST_URL, auth, setAuth, setPosts }) => {

    const [postData, setPostData] = useState({
        body: '',
        media: {
            images: [],
            videos: []
        },
        featured: false,
        tags: [],
    });

    const [buttonStatus, setButtonStatus] = useState("Post");
    const [showImageInput, setShowImageInput] = useState(false);
    const [showVideoInput, setShowVideoInput] = useState(false);

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

    const handleChange = (e) => {
        setPostData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    useEffect(() => {
        const words = postData.body.split(/\s+/).map(word => word.replace(/[^\w#].*$/g, ''));
        const foundTags = [...new Set(
            words.filter(word => word.startsWith('#') && word.length > 1)
                .map(tag => tag.slice(1).trim().toLowerCase())
        )];


        setPostData(prev => ({ ...prev, tags: foundTags }));
    }, [postData.body]);


    const handlePost = async (e) => {
        e.preventDefault();
        setButtonStatus("Loading...");

        const formattedBody = postData.body
            .replace(/(?<!\s)\n/g, " \n") // Add spaces before newlines
            .replace(/(?<!\s)#/g, " #") // Add spaces before hashtags
            .replace(/\n#/g, "\n #"); // Add spaces before hashtags after newlines

        const words = formattedBody.split(/\s+/).map(word => word.replace(/[^\w#].*$/g, ''));
        const tagsAfterFormatting = [
            ...new Set(
                words
                    .filter((word) => word.startsWith("#") && word.length > 1)
                    .map((tag) => tag.slice(1).trim().toLowerCase())
            ),
        ];

        const postToSend = {
            ...postData,
            body: formattedBody,
            tags: tagsAfterFormatting,
        };

        try {
            const response = await axiosPrivate.post(POST_URL, postToSend, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                withCredentials: true,
            });

            const fullPost = await axiosPrivate.get(`${POST_URL}/${response.data.post._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                withCredentials: true,
            });

            setPosts(prev => [fullPost.data, ...prev]);
            setPostData((prev) => ({
                ...prev,
                body: '',
                media: {
                    images: [],
                    videos: []
                },
                featured: false,
                tags: [],
            }));
            showSuccess('Post successfully created.');

            // Helper to update Dashboard total posts counter
            setAuth(prev => ({
                ...prev,
                totalPosts: [...prev.totalPosts, fullPost.data._id]
            }));

        }
        catch (err) {
            // If no error response
            if (!err?.response) {
                showError('No Server Response');
            } else {
                showError(`${JSON.stringify(err.response.data.message).slice(1, -1)}` || 'Error creating post.');
            }
        }
        finally {
            setButtonStatus("Post");
        }
    }

    return (
        <div className="mx-auto bg-base-100 p-4 rounded-lg shadow-md mb-6">
            {/* Top Row: Avatar and Input */}
            <div className="flex gap-4">
                <img
                    src={auth.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"}
                    alt="avatar"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm"
                />
                <textarea
                    id="body"
                    onChange={handleChange}
                    value={postData.body}
                    autoComplete="off"
                    className="w-full min-h-[120px] max-h-[300px] rounded-xl bg-base-200 p-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    rows="3"
                    placeholder={`What's on your mind, ${auth.firstName}?`}
                />
            </div>

            {/* Media Preview / Inputs */}
            {(showImageInput || postData.media.images[0]) && (
                <div className="mt-4 animate-fade-in pl-14 md:pl-16">
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="Paste image URL..."
                            className="input input-sm w-full"
                            autoFocus={showImageInput}
                            onChange={(e) =>
                                setPostData(prev => ({
                                    ...prev,
                                    media: {
                                        ...prev.media,
                                        images: e.target.value ? [e.target.value] : []
                                    }
                                }))
                            }
                            value={postData.media.images[0] || ''}
                        />
                        {postData.media.images[0] && (
                            <img src={postData.media.images[0]} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover border border-base-300" onError={(e) => e.target.style.display = 'none'} onLoad={(e) => e.target.style.display = 'block'} />
                        )}
                    </div>
                </div>
            )}

            {(showVideoInput || postData.media.videos[0]) && (
                <div className="mt-4 animate-fade-in pl-14 md:pl-16">
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="Paste video URL..."
                            className="input input-sm w-full"
                            autoFocus={showVideoInput}
                            onChange={(e) =>
                                setPostData(prev => ({
                                    ...prev,
                                    media: {
                                        ...prev.media,
                                        videos: e.target.value ? [e.target.value] : []
                                    }
                                }))
                            }
                            value={postData.media.videos[0] || ''}
                        />
                    </div>
                </div>
            )}


            {/* Divider */}
            <div className="divider my-2"></div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 text-sm text-base-content/70">
                    <button
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showImageInput ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'}`}
                    >
                        📸 <span>Photo</span>
                    </button>
                    <button
                        onClick={() => setShowVideoInput(!showVideoInput)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showVideoInput ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'}`}
                    >
                        🎥 <span>Video</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostData(prev => ({ ...prev, featured: !prev.featured }))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${postData.featured ? 'bg-yellow-500/10 text-yellow-600' : 'hover:bg-base-200'}`}
                    >
                        {postData.featured ? '⭐️ Featured' : '☆ Feature'}
                    </button>

                </div>
                <button
                    onClick={handlePost}
                    className="btn btn-primary btn-sm px-6 rounded-full font-bold shadow-md shadow-primary/30"
                    disabled={postData.body.trim() === "" || buttonStatus === "Loading..."}
                >
                    {buttonStatus === "Loading..." ? <span className="loading loading-spinner loading-xs"></span> : "Post"}
                </button>
            </div>

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
        </div>
    )
}

export default CreatePost