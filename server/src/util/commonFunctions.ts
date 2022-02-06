import express from 'express';
import { routeInterface } from './types';

export const routesGenerator = (routes: routeInterface []) => {
    const router = express.Router();
    routes.forEach(route => {
        const { path, method, handler, middlewares } = route;
        const middlewareChain = middlewares ? middlewares.map(middleware => middleware) : [];
        middlewareChain.push(handler);
        router[method](path, ...middlewareChain);
    });
    return router;
}


export default {
    routesGenerator
};