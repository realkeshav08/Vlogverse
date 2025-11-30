const whitelist = [
    'http://localhost:5173',
    'https://vlogverse-git-master-asuskeshavkashyap-8825s-projects.vercel.app/'
]

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions
