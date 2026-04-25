import React, { useState } from 'react';

const mockJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechFlow",
        location: "Remote",
        type: "Full-time",
        logo: "https://ui-avatars.com/api/?name=TF&background=0D8ABC&color=fff"
    },
    {
        id: 2,
        title: "Content Creator",
        company: "Vlogverse",
        location: "New York, NY",
        type: "Contract",
        logo: "https://ui-avatars.com/api/?name=VV&background=ff5722&color=fff"
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Creative Studio",
        location: "Remote",
        type: "Part-time",
        logo: "https://ui-avatars.com/api/?name=CS&background=673ab7&color=fff"
    }
];

const Jobs = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = mockJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">Find Your Next Gig</h1>
                <p className="text-base-content/60 mb-6">Explore the latest opportunities in tech and content creation.</p>

                <input
                    type="text"
                    placeholder="Search by job title or company..."
                    className="input w-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div key={job.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 border border-base-200">
                            <div className="card-body flex-row items-center gap-4">
                                <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
                                <div className="flex-1">
                                    <h2 className="card-title text-lg">{job.title}</h2>
                                    <p className="text-sm opacity-70">{job.company} • {job.location}</p>
                                </div>
                                <div className="badge badge-primary badge-outline">{job.type}</div>
                                <button className="btn btn-sm btn-ghost">Apply</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-50">
                        No jobs found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
