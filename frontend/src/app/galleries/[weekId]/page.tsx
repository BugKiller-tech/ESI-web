'use client';

import { HorseInfo } from 'types';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default ({ }: {

}) => {
    const router = useRouter();
    const params = useParams();
    const { weekId } = params;
    // console.log('testingforforfor', params);

    const initialHorses = [
        { name: 'horse1', },
        { name: 'horse2', },
        { name: 'horse3', },
        { name: 'horse4', },
        { name: 'horse5', },
        { name: 'horse6', },
        { name: 'horse7', },
        { name: 'horse8', },
    ]
    const [horses, setHorses] = useState(initialHorses);

    const loadMoreHorses = () => {
        setHorses([
            ...horses,
            ...horses
        ])
    }

    const gotoHorseImages = ( horseId: number ) => {
        router.push(`/galleries/${weekId}/${horseId}`)
    }
    return (
        <div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4'>
                { horses.map((horse: HorseInfo, index) => {
                    return (
                        <div key={horse.name + index}
                            className='bg-orange-400 cursor-pointer
                            hover:scale-110 transition-transform duration-300
                            active:scale-90
                            rounded-lg overflow-hidden
                            flex gap-3'
                            onClick={() => {
                                gotoHorseImages(index);
                            }}>
                            <img src="/horse_folder.png" className='w-[80px]' />
                            <div className='flex-1 flex items-center'>
                                <div>
                                    { horse.name }
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div>
            <div className='text-center mt-5'>
                <Button variant='secondary' onClick={loadMoreHorses}>Load more</Button>
            </div>
        </div>
    )
}