import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = 'http://10.20.9.15:8000/api';

const cafeApi = axios.create({ baseURL });

cafeApi.interceptors.request.use(
    async (config) => { 
        const token = await AsyncStorage.getItem('token');

        if (token) { 
            config.headers['x-token'] = token;
        }

        return config;
    }
)

export default cafeApi;