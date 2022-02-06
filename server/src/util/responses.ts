import { Response } from "express";
import { dynamicObjectInterface, responseTypeInterface } from "./types";

export function sendResponse(res: Response, response_type: responseTypeInterface, data?: dynamicObjectInterface, custom_message?: string, error?: Error) {
    const response = {
        message: custom_message || response_type.message,
        status: response_type.status,
        data: data || {},
        error: error || null,
    };
    console.info(JSON.stringify(response));
    error && console.error(error);
    res.status(response_type.status).json(response);
}