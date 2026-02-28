const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection failed: ${error.message}`);
        console.log('Server will continue running without database...');
        // removed process.exit(1) so server stays alive
    }
};

module.exports = connectDB;