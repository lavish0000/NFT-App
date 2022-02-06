import 'dotenv/config'

import express from 'express';
import cors from 'cors';

import routes from './routes';


const app = express();

app.use(express.urlencoded({
    limit: '5mb',
    extended: true
}));

app.use(express.json({
    limit: '5mb'
}));

app.use(cors());


app.use('/api', routes);

app.listen(process.env.PORT, () => {
    console.log('App  is running on port: ', process.env.PORT);
});