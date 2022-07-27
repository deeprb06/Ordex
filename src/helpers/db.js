import config from '../config/index';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongo_host = config.MONGO_HOST;
        console.log(mongo_host, '-mongo_host`')
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(mongo_host, options);
        return mongoose.connection;
        console.info('MongoDB Connected...');
    } catch (err) {
        console.error('err');
        console.error(err);
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;