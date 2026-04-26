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
        <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-10 group hover:border-primary/40 transition-all duration-500">
            {/* Top Row: Avatar and Input */}
            <div className="flex gap-6">
                <div className="relative flex-shrink-0">
                    <img
                        src={auth.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"}
                        alt="avatar"
                        className="w-14 h-14 rounded-none border border-white/20 p-1 bg-[#0a0a0c]"
                    />
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 transition-all duration-500"></div>
                </div>
                <textarea
                    id="body"
                    onChange={handleChange}
                    value={postData.body}
                    autoComplete="off"
                    className="w-full min-h-[140px] max-h-[400px] bg-transparent border-none p-0 text-lg text-white font-medium placeholder:text-white/20 focus:outline-none focus:ring-0 transition-all resize-none leading-relaxed"
                    rows="3"
                    placeholder={`Transmit a log, ${auth.firstName}...`}
                />
            </div>

            {/* Media Preview / Inputs */}
            {(showImageInput || postData.media.images[0]) && (
                <div className="mt-6 pl-20">
                    <div className="relative group/input">
                        <input
                            type="url"
                            placeholder="Neural link to image (URL)..."
                            className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all"
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
                            <div className="mt-4 relative border border-white/10 inline-block overflow-hidden">
                                <img src={postData.media.images[0]} alt="Preview" className="h-40 w-auto object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500" onError={(e) => e.target.style.display = 'none'} onLoad={(e) => e.target.style.display = 'block'} />
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(showVideoInput || postData.media.videos[0]) && (
                <div className="mt-6 pl-20">
                    <div className="relative group/input">
                        <input
                            type="url"
                            placeholder="Neural link to video (URL)..."
                            className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all"
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
            <div className="h-[1px] bg-white/5 my-8"></div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${showImageInput ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                    >
                        <span>IMAGE</span>
                    </button>
                    <button
                        onClick={() => setShowVideoInput(!showVideoInput)}
                        className={`flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${showVideoInput ? 'bg-primary border-primary text-white' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                    >
                        <span>VIDEO</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostData(prev => ({ ...prev, featured: !prev.featured }))}
                        className={`flex items-center gap-3 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${postData.featured ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                    >
                        <span>{postData.featured ? 'PRIORITY' : 'NORMAL'}</span>
                    </button>

                </div>
                <button
                    onClick={handlePost}
                    className="h-12 px-10 bg-primary text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-primary/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]"
                    disabled={postData.body.trim() === "" || buttonStatus === "Loading..."}
                >
                    {buttonStatus === "Loading..." ? "TRANSMITTING..." : "TRANSMIT"}
                </button>
            </div>

            {/* Toast Components */}
            <SuccessToast message={successMessage} show={showSuccessToast} status="success" icon={<FaCheckCircle className="text-white text-xl" />} />
            <ErrorToast message={errorMessage} show={showErrorToast} status="error" icon={<FaTimesCircle className="text-white text-xl" />} />
        </div>
    )
}

export default CreatePost