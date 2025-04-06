import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5100/api',
    withCredentials:true
})

const refreshAccessToken= async ()=>{
    try{
        const response = await api.post('/usuarios/refresh')
        return response.data.accessToken;
    }catch(e){
        return null
    }
}

api.interceptors.response.use(
    res=>res,
    async err=>{
        if(err.response?.status===401 && !err.config._retry){
            err.config._retry=true;
            const newToken = await refreshAccessToken()
            if(newToken){
                err.config.headers['Authorization'] = `Bearer ${newToken}`
                return api(err.config)
            }
        }
        return Promise.reject(err)
    }
)

export default api