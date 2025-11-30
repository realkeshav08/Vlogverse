const allowedOrigins = [
    'http://localhost:5173',
    'https://vlogverse-git-master-asuskeshavkashyap-8825s-projects.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

module.exports = corsOptions;
