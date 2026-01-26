const mongoose = require('mongoose');

const connectDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                console.error('Could not connect to MongoDB. Exiting...');
                process.exit(1);
            }
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

module.exports = connectDB;
