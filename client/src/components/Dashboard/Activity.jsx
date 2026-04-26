import React from 'react'

function Activity() {
  const activities = [
    { name: "IBM", action: "New Job Listing", time: "2m ago" },
    { name: "Sally Bars", action: "Shared a post", time: "15m ago" },
    { name: "Kami Garces", action: "Earned Certificate", time: "1h ago" },
    { name: "Netflix", action: "New Job Listing", time: "3h ago" }
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-none overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <span className="material-symbols-outlined text-[14px]">timeline</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Global Pulse</h3>
        </div>

        <div className="flex flex-col gap-4">
          {activities.map((act, i) => (
            <div className="group/act relative p-4 bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all duration-300" key={i}>
              <div className="flex items-center gap-4">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s"
                  alt=""
                  className="w-10 h-10 rounded-none border border-white/10"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white/80 uppercase tracking-tighter">{act.name}</span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{act.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mt-1">{act.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Activity
