'use client';

import { WeekInfo } from 'types';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';

export default ({ initialWeeks }: {
    initialWeeks: WeekInfo[]
}) => {
    const router = useRouter();

    const [weeks, setWeeks] = useState(initialWeeks);

    const loadMoreWeeks = () => {
        setWeeks([
            ...weeks,
            ...weeks,
        ])
    }

    const goToHorsesPage = (id: number) => {
        router.push(`/galleries/${id}/`)
    }

    return (
        <div>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4'>
                { weeks.map((weekInfo: WeekInfo, index) => {
                    return (
                        <div key={weekInfo.name + index}
                            className='bg-orange-500 cursor-pointer
                            hover:scale-110 transition-transform duration-300
                            active:scale-90
                            rounded-lg overflow-hidden'
                            onClick={() => { goToHorsesPage(index) }}>
                            <img src="/week_folder.png" />
                            <div className='px-3 py-2'>{ weekInfo.name }</div>
                        </div>
                    )
                }) }
            </div>
            <div className='text-center mt-5'>
                <Button variant='secondary' onClick={ loadMoreWeeks }>Load more</Button>
            </div>
        </div>
    )
}