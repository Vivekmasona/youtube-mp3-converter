import { axiosObj } from '../util/axios';

const convert = async ({ link,index }) => {
    try {
        const response = await axiosObj.post('/convert', {
            link,
            index
        });
        return { data: response.data };
    } catch (error) {
        return { error: error.response.data };
    }
};

export default convert;