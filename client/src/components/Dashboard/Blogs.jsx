import React from 'react'

const Forums = () => {
    const blogs = [
        { title: "Clean up your resume", comments: 20 },
        { title: "React v20.5 Deep Dive", comments: 5 },
        { title: "MERN Stack in 2026", comments: 15 },
        { title: "How to train a dragon", comments: 33 }
    ];

    return (
        <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-none overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all duration-500">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/30">
                            <span className="material-symbols-outlined text-[14px]">forum</span>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Archive Logs</h3>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline cursor-pointer">Index</div>
                </div>

                <div className="flex flex-col gap-4">
                    {blogs.map((blog, i) => (
                        <div className="group/blog relative p-4 bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all duration-300" key={i}>
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"
                                    alt=""
                                    className="w-10 h-10 rounded-none border border-white/10"
                                />
                                <div className="flex-1">
                                    <span className="text-xs font-black text-white/80 uppercase tracking-tighter block truncate">{blog.title}</span>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{blog.comments} Responses</span>
                                        <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">Open</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Forums