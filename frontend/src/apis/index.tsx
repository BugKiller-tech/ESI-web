import {
    createAxiosInstance
} from './createAxiosInstance';

export const signIn = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/auth/signin', data);
}

export const getImageProcessSetting = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/admin/setting/image-process-setting');
}

export const saveImageProcessSetting = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/setting/image-process-setting', data);
}

export const getWatermarkImage = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/admin/setting/watermark-image');
}

export const uploadWatermarkImage = async (formData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/setting/upload-watermark-image', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const uploadHorseImages = async (formData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/upload/horses', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const uploadFtpFolderAndTimestamp = async (formData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/upload/timestamp-and-ftp-folder', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getFtpImageProcessTaskStatus = async (taskId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/tracker/ftp_image_process_status/${taskId}`);
}

export const getHorsesFtpFolders = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/admin/upload/list-horses-ftp-folders')
}

export const getTaxAndShippingFeeSetting = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/admin/setting/tax-and-shipping-fee');
}

export const updateTaxAndShippingFeeSetting = async (formData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/setting/tax-and-shipping-fee', formData);
}

export const getProductCategories = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/products/categories');
}

export const getProducts = async (filters: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/products/get', filters);
}
export const getAllProducts = async (token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get('/api/v1/products/get-all');
}

export const createProduct = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/products/create', data);
}

export const deleteProduct = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/products/delete', data);
}

export const getProduct = async (productId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/products/get/${productId}`);
}

export const updateProduct = async (productId: string, data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post(`/api/v1/products/update/${productId}`, data);
}

export const getHorseWeeks = async (filters: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/weeks/get-paginated', filters);
}

export const updateHorseWeekVisibility = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/weeks/update-visibility', data);
}
export const updateHorseWeekDeleteState = async (data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/weeks/delete', data);
}

export const getHorsesByWeekIdAdmin = async (weekId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/horses/${weekId}/horse-names`);
}

export const getHorseImagesByHorseNumberForAdmin = async (weekId: string, horseNumber: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/horses/${weekId}/horses/${horseNumber}`);
}

export const deleteHorseImageByAdmin = async (weekId: string, horseImageId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.delete(`/api/v1/admin/horses/${weekId}/horses/${horseImageId}/delete`);
}

export const deleteHorseByAdmin = async (weekId: string, horseNumber: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.delete(`/api/v1/admin/horses/${weekId}/horses/${horseNumber}/delete-all-images`);
}

export const changeHorseNumberForImages = async (data: any, token: string = '') => {
    const {
        weekId
    } = data;
    const axios = await createAxiosInstance(token);
    return axios.post(`/api/v1/admin/horses/${weekId}/horses/change-horse-number-for-images`, data);
}

export const getWeeksByState = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/front/weeks/get-weeks-for-state', postData);
}

export const getHorsesByWeek = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/front/horses/get-horses-for-week', postData);
}

export const searchHorse = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/front/horses/search-horse', postData);
}

export const getHorseImagesByWeekAndHorseNumber = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/front/horses/get-horse-images-by-week-and-horsenumber', postData);
}

export const createStripeCheckoutSession = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/checkout/stripe/create-checkout-session', postData);
}


export const getOrdersWithPaginated = async (filters: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post('/api/v1/admin/orders/get-paginated', filters);
}

export const getOneOrder = async (orderId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/orders/${orderId}/get`);
}

export const updateOrderStatus = async (postData: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post(`/api/v1/admin/orders/update-order-status`, postData);
}

export const downloadImagesZipForOrder = async (orderId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/orders/${orderId}/download-images-zip`, {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const refundForOrderByAdmin = async (orderId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/orders/${orderId}/refund`);
}


export const downloadInvoiceForOrder = async (orderId: string, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.get(`/api/v1/admin/orders/${orderId}/download-invoice`, {
        responseType: 'blob',
    })
}

export const sendContactUsInfo = async(data: any, token: string = '') => {
    const axios = await createAxiosInstance(token);
    return axios.post(`/api/v1/support/contact-us`, data);
}
