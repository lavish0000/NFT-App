import axios from 'axios';
import { generateUniqueBrowserId } from '../utils/commonFunction';

const unique_browser_id = generateUniqueBrowserId();

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "unique-browser-id": unique_browser_id,
    }
});
export default instance;