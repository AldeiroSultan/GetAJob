const mongoose = require('mongoose');
const dns = require('dns');

// force Node to use Google's DNS just for this process
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed: ${error.message}`);
        console.log('Server will continue running without database...');
    }
};

module.exports = connectDB; 