import { IItemContent } from '../utils/types';
import axios from './axiosInstance';

const baseRoute = 'nft/';

export const getAllItems = async (type: string = "") => {
    const response = await axios.get(`${baseRoute}getAllItems/${type}`);
    return response.data.data;
}

export const createItem = async (payload: IItemContent) => {
    const response = await axios.post(`${baseRoute}create`, payload);
    return response.data.data;
}

export const updateItem = async (id: number, updatedData: Partial<IItemContent>) => {
    const response = await axios.put(`${baseRoute}update`, { id, updatedData });
    return response.data.data;
}