import { NextFunction, Request, Response } from "express";

export enum HTTP_METHODS {
    GET = "get",
    POST = "post",
    PUT = "put",
}

export interface routeInterface {
    path: string;
    method: HTTP_METHODS;
    handler: (req: Request, res: Response) => void;
    middlewares?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export interface dynamicObjectInterface {
    [key: string]: any;
}

export interface responseTypeInterface {
    message: string;
    status: number;
}

export enum ITEM_TYPES {
    ALL = "all",
    OPEN = "open",
    OWNED = "owned",
}