import axios from '@/apis/axios';


export const getImageProcessSetting = () => {
    return axios.get('/api/admin/setting/image-process-setting');
}

export const saveImageProcessSetting =  (data: any) => {
    return axios.post('/api/admin/setting/image-process-setting', data);
}

export const getWatermarkImage = () => {
    return axios.get('/api/admin/setting/watermark-image');
}

export const uploadWatermarkImage = (formData: any) => {
    return axios.post('/api/admin/setting/upload-watermark-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const uploadHorseImages = (formData: any) => {
    return axios.post('/api/admin/upload/horses', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const uploadFtpFolderAndTimestamp = (FormData: any) => {
    return axios.post('/api/admin/upload/timestamp-and-ftp-folder', FormData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getHorsesFtpFolders = () => {
    return axios.get('/api/admin/upload/list-horses-ftp-folders')
}

export const getTaxAndShippingFeeSetting = () => {
    return axios.get('/api/admin/setting/tax-and-shipping-fee');
}

export const updateTaxAndShippingFeeSetting = (formData: any) => {
    return axios.post('/api/admin/setting/tax-and-shipping-fee', formData);
}

export const getProductCategories = () => {
    return axios.get('/api/products/categories');
}

export const getProducts = (filters: any) => {
    return axios.post('/api/products/get', filters);
}

export const createProduct = (data: any)=> {
    return axios.post('/api/products/create', data);
}

export const deleteProduct = (data: any) => {
    return axios.post('/api/products/delete', data);
}

export const getProduct = (productId: string) => {
    return axios.get(`/api/products/get/${productId}`); 
}

export const updateProduct = (productId: string, data: any) => {
    return axios.post(`/api/products/update/${productId}`, data);
}

export const getHorseWeeks = (filters: any) => {
    return axios.post('/api/admin/weeks/get', filters);
}

export const updateHorseWeekVisibility = (data: any) => {
    return axios.post('/api/admin/weeks/update-visibility', data);
}

export const getHorsesByWeekId = (weekId: string) => {
    return axios.get(`/api/admin/horses/${weekId}/horse-names`);
}

export const getHorseImagesByHorseNumberForAdmin = (weekId: string, horseNumber: string) => {
    return axios.get(`/api/admin/horses/${weekId}/horses/${horseNumber}`);
}
