// 'use client'
// import { useState, useTransition,
//     useEffect
//  } from 'react';
import { auth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table/data-table';
import * as APIs from '@/apis';
import { toast } from 'sonner';
import { searchParamsCache } from '@/lib/searchparams';
import { Order } from 'types';
import { columns } from './columns';


export default async function () {

    // const [ loadingData, startTransitionForLoadingData ] = useTransition();
    
    const page = searchParamsCache.get('page');
    const search = searchParamsCache.get('q');
    const pageLimit = searchParamsCache.get('limit');
    const session = await auth();
    // const [ searchTerm, setSearchTerm ] = useState('');

    // const [categories, setCategories] = useState([]);
    // const [totalCount, setTotalCount] = useState(0);

    let orders: Order[] = [];
    let totalCount = 0;


    const fetchOrders = async () => {
        try {
            const filters = {
                page: page || 1,
                limit: pageLimit || 10,
                search: search || '',
            }
            const response = await APIs.getOrdersWithPaginated(filters, session?.user?.accessToken)
            console.log('fetching orders', response.data);
            if (response.data.orders) {
                // setCategories(response.data.categories);
                // setTotalCount(response.data.totalCount)
                orders = response.data.orders;
                totalCount = response.data.totalCount;
                console.log('fetching orders', orders);

            }
        } catch (error) {
            // toast.error('Failed to fetch weeks');
            console.log('error for fetching categories', error);
        }
    }

    // useEffect(() => {
    //     fetchOrders();
    // })
    try {
        await fetchOrders();
    } catch(error) {
        toast.error('Failed to fetch weeks');
    }


    // const searchCategories = () => {

    // }


    return (
        <DataTable 
            columns={columns}
            data={orders}
            totalItems={totalCount}
        />
    )
}