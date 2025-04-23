'use client';

import { HorseInfo } from 'types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFullScreenLoader } from '@/context/FullScreenLoaderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import * as APIs from '@/apis';
import { containsAllWords } from '@/utils';

export default ({ }: {

}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const fullScreenLoader = useFullScreenLoader();

    const params = useParams();
    const { state, weekId } = params;
    // console.log('testingforforfor', params);

    const [horses, setHorses] = useState<HorseInfo[]>([]);
    const [filteredHorses, setFilteredHorses] = useState<HorseInfo[]>([]);

    const [ searchTerm, setSearchTerm ] = useState('');
    const [forceApplyFilter, setForceApplyFilter] = useState(false);


    const filterBySearchTermAction = (term='') => {
        if (!term) {
            term = searchTerm;
        }
        if (!term) {
            setFilteredHorses(horses);
        } else {
            setFilteredHorses(horses.filter(h => {
                return containsAllWords(h.horseNumber, term)            
            }))
            localStorage.setItem('horsesSearchTerm', searchTerm);
        }
    }


    useEffect(() => {
        // const term = localStorage.getItem('horsesSearchTerm');
        // if (term) {
        //     setSearchTerm(term);
        // }
        fetchHorses();
    }, []);

    useEffect(() => {
        filterBySearchTermAction();
    }, [ forceApplyFilter ]);

    const fetchHorses = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.getHorsesByWeek({
                weekId: weekId,
            }, session?.user?.accessToken)
            if (response.data.horses) {
                setHorses(response.data.horses);
                setForceApplyFilter(!forceApplyFilter);
            }
        } catch (error) {
            console.log(error);
        } finally {
            fullScreenLoader.hideLoader();            
        }
    }


    const searchHorsesBySearchTerm = () => {
        filterBySearchTermAction();
    }




    const loadMoreHorses = () => {

    }

    const gotoHorseImages = ( horseNumber: string ) => {
        router.push(`/events/${state}/${weekId}/${horseNumber}`)
    }
    return (
        <div>
            <div className='flex items-center gap-2 mb-3'>
                <Input type='text' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }}
                    placeholder='Search for horse' className='bg-white'
                    onKeyUp={(e) => {
                        if (e.key == 'Enter') {
                            searchHorsesBySearchTerm();
                        }
                    }}/>
                <Button onClick={searchHorsesBySearchTerm}>Search</Button>
            </div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
                { filteredHorses.map((horse, index) => {
                    return (
                        <div key={horse.horseNumber + index}
                            className='cursor-pointer
                            rounded-lg overflow-hidden
                            flex flex-col
                            bg-center bg-no-repeat bg-cover'
                            // style={{ backgroundImage: `url(${horse.thumbnailS3Link})` }}
                            style={{ backgroundImage: `url(/horse_folder.png)` }}
                            onClick={() => {
                                gotoHorseImages(horse.horseNumber);
                            }}>
                            <div className='min-h-[100px] md:min-h-[200px]'></div>
                            <div className='flex-1 flex items-center bg-main-horse px-3 py-2'>
                                <div className='font-bold'>
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