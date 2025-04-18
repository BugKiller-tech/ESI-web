'use client';
import {
    useMemo
} from 'react';

export default ({
    orderStatus
}: {
    orderStatus: string;
}) => {
    const bgColor = useMemo(() => {
        let bgColor = '';
        switch (orderStatus) {
            case 'New':
                bgColor = 'bg-red-600';
                break;
            case 'Processing':
                bgColor = 'bg-blue-600'
                break;
            case 'Shipped':
                bgColor = 'bg-green-600'
                break;
            case 'Refunded':
                bgColor = 'bg-pink-600'
                break;
            default:
                bgColor = 'bg-gray-500'
        }
        return bgColor;
    }, [orderStatus])
            
    return (
        <span className={`px-2 py-1 rounded ${bgColor} text-white font-bold text-xs`}>
            { orderStatus }
        </span>
    )
}