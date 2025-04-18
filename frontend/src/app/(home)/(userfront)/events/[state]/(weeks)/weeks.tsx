'use client';

import { WeekInfo } from 'types';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { containsAllWords } from '@/utils';


export default ({ initialWeeks }: {
    initialWeeks: WeekInfo[]
}) => {
    const router = useRouter();
    const params = useParams();
    const { state } = params;

    const [weeks, setWeeks] = useState<WeekInfo[]>(initialWeeks);
    const [filteredWeeks, setFilteredWeeks] = useState<WeekInfo[]>([]);

    const [ searchTerm, setSearchTerm ] = useState('');

    
    

    const filterBySearchTermAction = (term='') => {
        // don't need to have search filter on weeks for now
        setFilteredWeeks(weeks);
        return;

        if (!term) {
            term = searchTerm;
        }
        if (!term) {
            setFilteredWeeks(weeks);
        } else {
            setFilteredWeeks(weeks.filter(w => {
                return containsAllWords(`${w.year}${w.state}${w.weekNumber}`, term)            
            }))
            localStorage.setItem('weekSearchTerm', searchTerm);
        }
    }

    useEffect(() => {
        // const term = localStorage.getItem('weekSearchTerm');
        // if (term) {
        //     setSearchTerm(term);
        //     filterBySearchTermAction(term);
        // }
        filterBySearchTermAction();
    }, []);


    const searchWeeksByTerm = () => {
        if (!searchTerm) {
            toast.error('Please enter the search term');
        }
        filterBySearchTermAction();
        
    }

    // const loadMoreWeeks = () => {
    // }

    const goToHorsesPage = (_id: string) => {
        router.push(`/events/${state}/${_id}`);
    }

    return (
        <div>
            {/* <div className='flex items-center gap-2'>
                <Input type='text' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }}
                    placeholder='Search for week' className='bg-white'
                    onKeyUp={(e) => {
                        if (e.key == 'Enter') {
                            searchWeeksByTerm();
                        }
                    }}/>
                <Button onClick={searchWeeksByTerm}>Search</Button>
            </div> */}
            <div className='mt-5 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
                { filteredWeeks.map((weekInfo: WeekInfo, index) => {
                    return (
                        <div key={weekInfo.displayName + weekInfo._id}
                            className='bg-main-color cursor-pointer
                            hover:scale-110 transition-transform duration-300
                            active:scale-90
                            rounded-lg overflow-hidden'
                            onClick={() => { goToHorsesPage(weekInfo._id) }}>
                            <img src="/week_folder.png" />
                            <div className='px-3 py-2 text-white font-bold'>{ weekInfo.displayName }</div>
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