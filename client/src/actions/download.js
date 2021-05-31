import { axiosBlob } from '../util/axios';

const download = async (token) => {
    try {
        const response = await axiosBlob.post('/download', {
            token
        });
        return { response };
    } catch (error) {
        return { error: error.response.data, success: false };
    }
};

export default download;