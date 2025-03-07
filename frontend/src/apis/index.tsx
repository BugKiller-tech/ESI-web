import axios from '@/apis/axios';


export const saveImageProcessSetting = async (data: any) => {
    const response = await axios.post('/posts', data);
    return response.data;
}