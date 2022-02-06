import { routesGenerator } from "../../util/commonFunctions";
import { HTTP_METHODS, routeInterface } from "../../util/types";
import { authMiddleware } from "./Auth";
import { createNFTItem, getAllNFTItems, updateNFTItem } from "./controller";
import { createNFTItemValidator, getAllNFTItemsValidator, updateNFTItemValidator } from "./validator";

const routes: routeInterface [] = [
    {
        path: '/create',
        method: HTTP_METHODS.POST,
        handler: createNFTItem,
        middlewares: [authMiddleware, createNFTItemValidator],

    },
    {
        path: '/update',
        method: HTTP_METHODS.PUT,
        handler: updateNFTItem,
        middlewares: [authMiddleware, updateNFTItemValidator],
    },
    {
        path: '/getAllItems/:type',
        method: HTTP_METHODS.GET,
        handler: getAllNFTItems,
        middlewares: [authMiddleware, getAllNFTItemsValidator],
    }
];

export default routesGenerator(routes);