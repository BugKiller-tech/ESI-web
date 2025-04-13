'use client';

import { HorseInfo } from 'types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import * as APIs from '@/apis';

export default ({ }: {

}) => {
    const router = useRouter();
    const fullScreenLoader = useFullScreenLoader();

    const params = useParams();
    const { state, weekId } = params;
    // console.log('testingforforfor', params);

    const [horses, setHorses] = useState<HorseInfo[]>([]);


    useEffect(() => {
        fetchHorses();
    }, []);

    const fetchHorses = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.getHorsesByWeek({
                weekId: weekId,
            })
            if (response.data.horses) {
                setHorses(response.data.horses);
            }
        } catch (error) {
            console.log(error);
        } finally {
            fullScreenLoader.hideLoader();            
        }
    }




    const loadMoreHorses = () => {

    }

    const gotoHorseImages = ( horseId: string ) => {
        router.push(`/events/${state}/${weekId}/${horseId}`)
    }
    return (
        <div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
                { horses.map((horse, index) => {
                    return (
                        <div key={horse.horseNumber + index}
                            className='bg-orange-400 cursor-pointer
                            hover:scale-110 transition-transform duration-300
                            active:scale-90
                            rounded-lg overflow-hidden
                            flex gap-3'
                            onClick={() => {
                                gotoHorseImages(horse._id);
                            }}>
                            <img src="/horse_folder.png" className='w-[80px]' />
                            <div className='flex-1 flex items-center'>
                                <div>
                                    { horse.horseNumber }
                                </div>
                            </div>
                        </div>
                    )
                }) }
            </div>
            {/* <div className='text-center mt-5'>
                <Button variant='secondary' onClick={loadMoreHorses}>Load more</Button>
            </div> */}
        </div>
    )
}