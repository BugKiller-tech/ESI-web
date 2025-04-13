import axios from '@/apis/axios';


export const getImageProcessSetting = () => {
    return axios.get('/api/v1/admin/setting/image-process-setting');
}

export const saveImageProcessSetting =  (data: any) => {
    return axios.post('/api/v1/admin/setting/image-process-setting', data);
}

export const getWatermarkImage = () => {
    return axios.get('/api/v1/admin/setting/watermark-image');
}

export const uploadWatermarkImage = (formData: any) => {
    return axios.post('/api/v1/admin/setting/upload-watermark-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const uploadHorseImages = (formData: any) => {
    return axios.post('/api/v1/admin/upload/horses', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const uploadFtpFolderAndTimestamp = (FormData: any) => {
    return axios.post('/api/v1/admin/upload/timestamp-and-ftp-folder', FormData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getHorsesFtpFolders = () => {
    return axios.get('/api/v1/admin/upload/list-horses-ftp-folders')
}

export const getTaxAndShippingFeeSetting = () => {
    return axios.get('/api/v1/admin/setting/tax-and-shipping-fee');
}

export const updateTaxAndShippingFeeSetting = (formData: any) => {
    return axios.post('/api/v1/admin/setting/tax-and-shipping-fee', formData);
}

export const getProductCategories = () => {
    return axios.get('/api/v1/products/categories');
}

export const getProducts = (filters: any) => {
    return axios.post('/api/v1/products/get', filters);
}

export const createProduct = (data: any)=> {
    return axios.post('/api/v1/products/create', data);
}

export const deleteProduct = (data: any) => {
    return axios.post('/api/v1/products/delete', data);
}

export const getProduct = (productId: string) => {
    return axios.get(`/api/v1/products/get/${productId}`); 
}

export const updateProduct = (productId: string, data: any) => {
    return axios.post(`/api/v1/products/update/${productId}`, data);
}

export const getHorseWeeks = (filters: any) => {
    return axios.post('/api/v1/admin/weeks/get', filters);
}

export const updateHorseWeekVisibility = (data: any) => {
    return axios.post('/api/v1/admin/weeks/update-visibility', data);
}

export const getHorsesByWeekIdAdmin = (weekId: string) => {
    return axios.get(`/api/v1/admin/horses/${weekId}/horse-names`);
}

export const getHorseImagesByHorseNumberForAdmin = (weekId: string, horseNumber: string) => {
    return axios.get(`/api/v1/admin/horses/${weekId}/horses/${horseNumber}`);
}

export const getWeeksByState = (postData: any) => {
    return axios.post('/api/v1/front/weeks/get-weeks-for-state', postData);
}

export const getHorsesByWeek = (postData: any) => {
    return axios.post('/api/v1/front/horses/get-horses-for-week', postData);
}
