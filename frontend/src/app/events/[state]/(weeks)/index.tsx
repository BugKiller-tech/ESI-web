'use client';

import { WeekInfo } from 'types';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button';


export default ({ initialWeeks }: {
    initialWeeks: WeekInfo[]
}) => {
    const router = useRouter();
    const params = useParams();
    const { state } = params;

    const [weeks, setWeeks] = useState<WeekInfo[]>(initialWeeks);

    const loadMoreWeeks = () => {
        
    }

    const goToHorsesPage = (_id: string) => {
        router.push(`/events/${state}/${_id}`);
    }

    return (
        <div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
                { weeks.map((weekInfo: WeekInfo, index) => {
                    return (
                        <div key={weekInfo.displayName + weekInfo._id}
                            className='bg-orange-500 cursor-pointer
                            hover:scale-110 transition-transform duration-300
                            active:scale-90
                            rounded-lg overflow-hidden'
                            onClick={() => { goToHorsesPage(weekInfo._id) }}>
                            <img src="/week_folder.png" />
                            <div className='px-3 py-2'>{ weekInfo.displayName }</div>
                        </div>
                    )
                }) }
            </div>
            {/* <div className='text-center mt-5'>
                <Button variant='secondary' onClick={ loadMoreWeeks }>Load more</Button>
            </div> */}
        </div>
    )
}