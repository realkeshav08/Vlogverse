const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const googleLogin = async (req, res) => {
    const { idToken } = req.body; // This is actually the access_token from the frontend

    try {
        // Fetch user info from Google using the access token
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });

        const payload = googleResponse.data;
        const { email, given_name, family_name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if they don't exist
            const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            let username = baseUsername;
            let count = 1;
            
            while (await User.findOne({ username })) {
                username = `${baseUsername}${count}`;
                count++;
            }

            user = await User.create({
                email,
                username,
                firstName: given_name || 'Vlogger',
                lastName: family_name || 'Verse',
                password: Math.random().toString(36).slice(-12),
                avatar: picture,
                role: 'user'
            });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { 
                id: user._id, 
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username, 
                email: user.email,
                role: user.role 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60m' }
        );

        const refreshToken = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                role: user.role 
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '15d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: `Welcome, ${user.firstName}!`,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                following: user.following || [],
                followers: user.followers || [],
                posts: user.posts || []
            },
            accessToken
        });

    } catch (error) {
        console.error('Google Login Error:', error.response?.data || error.message);
        res.status(401).json({ message: 'Invalid Google Token' });
    }
};

module.exports = { googleLogin };
