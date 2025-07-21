import axios from 'axios';
import env from './env';

const api = axios.create({
    baseURL: env.apiUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api; 