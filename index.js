import app from "./app";
import config from './src/config';
import connectDB from './src/helpers/db';
import swaggerUi from 'swagger-ui-express';


async function startServer() {
    // Establish a database connection for node's process
    await connectDB();


    const swaggerJSON = require('./swagger.json');
    // Adding swagger docs to development environment only
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON));

    
    app.listen(config.port, () => {
        console.log('Server Start on port ', config.port);
    });

}
startServer();