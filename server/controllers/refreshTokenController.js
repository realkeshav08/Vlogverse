require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;

        // Check if refresh token exists in cookies
        if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized: No token provided.' });

        const refreshToken = cookies.jwt;

        // Search for user with this refresh token
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) return res.status(403).json({ message: 'Forbidden: Invalid refresh token.' });

        // Verify the refresh token FIRST
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err || !decoded || foundUser.email !== decoded.email) {
                return res.status(403).json({ message: 'Forbidden: Token mismatch or expired.' });
            }

            // ONLY populate if token is valid
            const populatedUser = await User.findById(foundUser._id)
                .populate({
                    path: 'notifications',
                    options: { sort: { createdAt: -1 }, limit: 10 },
                    populate: { path: 'from', select: 'username avatar' }
                })
                .exec();

            // Generate new access token
            const accessToken = jwt.sign(
                {
                    id: foundUser._id,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    username: foundUser.username,
                    email: foundUser.email,
                    role: foundUser.role,
                    avatar: foundUser.avatar,
                    totalPosts: foundUser.posts?.length || 0,
                    following: foundUser.following?.length || 0,
                    followers: foundUser.followers?.length || 0,
                    notifications: populatedUser?.notifications || []
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60m' }
            );

            res.json({
                id: foundUser._id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                username: foundUser.username,
                avatar: foundUser.avatar,
                role: foundUser.role,
                totalPosts: foundUser.posts?.length || 0,
                following: foundUser.following?.length || 0,
                followers: foundUser.followers?.length || 0,
                notifications: populatedUser?.notifications || [],
                accessToken
            });
        });
    } catch (err) {
        console.error('Error refreshing token: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    handleRefreshToken
};