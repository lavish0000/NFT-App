export enum LOADERS {
    GET_ITEMS = 'getItems',
    ADD_ITEM = 'addItem',
    UPDATE_ITEM = 'updateItem',
}

export interface IItemContent {
    title: string;
    description: string;
    image_url: string;
    created_by: string;
    owner: string;
    price: string;
    is_open_for_sale: boolean;
    is_active?: boolean;
    ethereum_address?: string;
}

export interface IItem extends IItemContent {
    id: number;
    created_at: string;
    updated_at: string;
    is_owner: number;
}

export interface IEditHandlerItem {
    title?: string;
    description?: string;
    price?: string;
    imageFile?: File;
    is_open_for_sale?: boolean;
    ethereum_address?: string;
    owner?: string;
  }

export enum ITEM_TYPES {
    ALL = "all",
    OPEN = "open",
    OWNED = "owned",
}