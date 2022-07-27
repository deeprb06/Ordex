import express from 'express';
import cors from 'cors';
import config from './src/config';
import common_routes from './src/routes';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.use(config.api.prefix, common_routes);

export default app;