import axios from 'axios';

export const axiosObj = axios.create({
    withCredentials: true
});

export const axiosBlob = axios.create({
    withCredentials: true,
    responseType:  'blob'
});