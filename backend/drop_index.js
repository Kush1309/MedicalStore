require('dotenv').config();
const mongoose = require('mongoose');

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        try {
            await collection.dropIndex('username_1');
            console.log('Successfully dropped index: username_1');
        } catch (error) {
            if (error.code === 27) {
                console.log('Index username_1 not found (already dropped?)');
            } else {
                throw error;
            }
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

dropIndex();
