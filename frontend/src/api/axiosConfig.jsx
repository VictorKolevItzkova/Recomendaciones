import axios from 'axios';
import { triggerLogout } from '../services/authService.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BACK,
    withCredentials: true
})

const refreshAccessToken = async () => {
    try {
        const response = await api.post('/usuarios/refresh')
        return response.data.accessToken;
    } catch (e) {
        return null
    }
}

api.interceptors.response.use(
    res => res,
    async err => {
        if (err.response?.status === 401 && !err.config._retry) {
            err.config._retry = true;
            const newToken = await refreshAccessToken();
            if (newToken) {
                api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
                console.log("API")
                err.config.headers['Authorization'] = `Bearer ${newToken}`;
                return api(err.config);
            } else {
                triggerLogout(); // Solo si el refresh también falla
            }
        }
        return Promise.reject(err)
    }
)

export default api