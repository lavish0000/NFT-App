import { NextFunction, Request, Response } from "express";
import { RESPONSE_TYPES } from "../../util/constants";
import { sendResponse } from "../../util/responses";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    console.info('API', req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('Params', JSON.stringify(req.params));
    console.log('Body', JSON.stringify(req.body));

    const unique_browser_id = req.headers['unique-browser-id'];

    if (!unique_browser_id) {
        sendResponse(res, RESPONSE_TYPES.UNAUTHORIZED, {});
        return;
    }
    next();
}