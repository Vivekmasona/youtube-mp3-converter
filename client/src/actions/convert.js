import { axiosObj } from '../util/axios';

const convert = async ({ link }) => {
    try {
        const response = await axiosObj.post('/convert', {
            link
        });
        return { data: response.data };
    } catch (error) {
        return { error: error.response.data };
    }
};

export default convert;