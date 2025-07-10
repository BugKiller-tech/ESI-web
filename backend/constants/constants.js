const ORDER_STATUS = {
    Draft: 'Draft',
    New: 'New',
    Processing: 'Processing',
    Shipped: 'Shipped/Completed',
    Refunded: 'Refunded',
}

const FTP_IMAGE_PROCESSOR_JOB_STATUS = {
    SUCCESS: 'SUCCESS',
    PROGRESS: 'PROGRESS',
    FAILURE: 'FAILURE',
}

module.exports = {
    originImagePath: 'uploads/originImages',
    timestampJsonPath: 'uploads/timestampJson',
    thumbwebPath: 'public/processedImages/thumbWeb',
    thumbnailPath: 'public/processedImages/thumbnail',
    watermarkPath: 'public/watermark',
    horseNamesExcelPath: 'uploads/horse-names-excel',
    INVOICES_PATH: 'invoices',

    S3_ORIGIN_IMAGE_KEY: 'images/origin',
    S3_THUMBNAIL_IMAGE_KEY: 'images/thumbnail',
    S3_THUMBWEB_IMAGE_KEY: 'images/thumbweb',


    API_VERSION: 'v1',
    ORDER_STATUS: ORDER_STATUS,
    AVAILABLE_ORDER_STATUS: Object.values(ORDER_STATUS),

    FTP_IMAGE_PROCESSOR_JOB_STATUS,
}
