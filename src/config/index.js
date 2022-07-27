import dotenv from 'dotenv'
import path from 'path'
dotenv.config();
export default {


    /**
     * Your favorite port
     */
    port: process.env.API_PORT || 8000,



    /* MongoDB Credentials */
    MONGO_HOST: process.env.MONGO_HOST || "mongodb://localhost:27017/TodoTest",

    JWT_SECRET: process.env.JWT_SECRET || 'cdcdcd',

    /**
     * API configs
     */
    api: {
        prefix: '/api'
    },
};
