import { Request, Response } from "express";
import { RESPONSE_TYPES } from "../../util/constants";
import { sendResponse } from "../../util/responses";
import { addNFTItemService, getAllNFTItemsService, getNFTItemByIdService, updateNFTItemService } from "./services";

export const createNFTItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body;

        const newItem = (await addNFTItemService(itemData)).rows[0];
        delete newItem.owner;
        delete newItem.created_by;
        newItem.is_owner = 1;

        sendResponse(res, RESPONSE_TYPES.SUCCESS, {data: newItem});

    } catch (error) {
        sendResponse(res, RESPONSE_TYPES.SERVER_ERROR, {}, "Server error", error);
    }
}

export const updateNFTItem = async (req: Request, res: Response) => {
    try {
        const { id, updatedData } = req.body;
        const unique_browser_id = req.headers['unique-browser-id'];

        const item = await getNFTItemByIdService(id);

        if (!item || !item.rowCount) {
            return sendResponse(res, RESPONSE_TYPES.NOT_FOUND, {}, "NFT not found");
        }

        const updatedItem = (await updateNFTItemService({ id, ...item.rows[0], ...updatedData })).rows[0];
        
        updatedItem.is_owner = +(unique_browser_id === updatedItem.owner);

        delete updatedItem.owner;
        delete updatedItem.created_by;

        sendResponse(res, RESPONSE_TYPES.SUCCESS, {data: updatedItem});

    } catch (error) {
        sendResponse(res, RESPONSE_TYPES.SERVER_ERROR, {}, "Server error", error);
    }
}

export const getAllNFTItems = async (req: Request, res: Response) => {
    try {
        const unique_browser_id = req.headers['unique-browser-id'] as string;
        
        const allNFTItems = await getAllNFTItemsService(unique_browser_id);

        sendResponse(res, RESPONSE_TYPES.SUCCESS, {data: allNFTItems.rows});

    } catch (error) {
        sendResponse(res, RESPONSE_TYPES.SERVER_ERROR, {}, "Server error", error);
    }
}