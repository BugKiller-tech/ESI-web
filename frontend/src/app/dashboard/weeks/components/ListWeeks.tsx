// 'use client'
// import { useState, useTransition,
//     useEffect
//  } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/table/data-table';
import * as APIs from '@/apis';
import { toast } from 'sonner';
import { searchParamsCache } from '@/lib/searchparams';
import { WeekInfo } from 'types';
import { columns } from './columns';


export default async function () {

    // const [ loadingData, startTransitionForLoadingData ] = useTransition();
    
    const page = searchParamsCache.get('page');
    const search = searchParamsCache.get('q');
    const pageLimit = searchParamsCache.get('limit');
    // const [ searchTerm, setSearchTerm ] = useState('');

    // const [categories, setCategories] = useState([]);
    // const [totalCount, setTotalCount] = useState(0);

    let weeks: WeekInfo[] = [];
    let totalCount = 0;


    const fetchCategories = async () => {
        try {
            const filters = {
                page: page || 1,
                limit: pageLimit || 10,
                search: search || '',
            }
            const response = await APIs.getHorseWeeks(filters)
            console.log('this is working or not', response.data);
            // const response = await APIs.getImageProcessSetting()
            if (response.data.weeks) {
                // setCategories(response.data.categories);
                // setTotalCount(response.data.totalCount)
                weeks = response.data.weeks;
                totalCount = response.data.totalCount;
                console.log('this is working or not', weeks);

            }
        } catch (error) {
            // toast.error('Failed to fetch weeks');
            console.log('error for fetching categories', error);
        }
    }

    // useEffect(() => {
    //     fetchCategories();
    // })
    try {
        await fetchCategories();
    } catch(error) {
        toast.error('Failed to fetch weeks');
    }


    // const searchCategories = () => {

    // }


    return (
        <DataTable 
            columns={columns}
            data={weeks}
            totalItems={totalCount}
        />
    )
}