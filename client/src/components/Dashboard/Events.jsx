import React from 'react'

function Events() {
  const events = [
    { title: "Job Interview", date: "Jan 30, 2026" },
    { title: "Attend Meeting", date: "Mar 14, 2026" },
    { title: "Interview XYZ", date: "Jun 01, 2026" },
    { title: "Application Deadline", date: "Jul 25, 2026" }
  ];

  return (
    <div className="bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-none overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/80">Future Nodes</h3>
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:underline cursor-pointer">Agenda</div>
        </div>

        <div className="flex flex-col gap-4">
          {events.map((event, i) => (
            <div className="group/event relative p-4 bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all duration-300" key={i}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white/80 uppercase tracking-tighter">{event.title}</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">{event.date}</span>
                </div>
                <button className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover/event:text-primary transition-colors">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events
