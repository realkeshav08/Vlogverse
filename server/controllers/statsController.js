const User = require('../models/User');

const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();

        res.json({
            users: userCount,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

module.exports = { getStats };
