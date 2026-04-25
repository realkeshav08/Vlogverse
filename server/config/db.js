const mongoose = require('mongoose');

const connectDB = async () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const prodUri = process.env.MONGO_URI_PROD;
    const devUri = process.env.MONGO_URI_DEV;

    let connectionUri;

    if (nodeEnv === 'production') {
        if (!prodUri) {
            console.error('CRITICAL ERROR: MONGO_URI_PROD is missing!');
            process.exit(1);
        }
        connectionUri = prodUri;
    } else {
        if (!devUri) {
            console.error('ERROR: MONGO_URI_DEV is missing!');
            process.exit(1);
        }
        connectionUri = devUri;
    }

    try {
        const conn = await mongoose.connect(connectionUri);
        console.log('----------------------------------------------------');
        console.log(`[DATABASE] Mode: ${nodeEnv.toUpperCase()}`);
        console.log(`[DATABASE] Name: ${conn.connection.name}`);
        console.log('----------------------------------------------------');
    } catch (error) {
        console.error(`[DATABASE ERROR]: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;