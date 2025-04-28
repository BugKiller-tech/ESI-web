'use client';

import {
    useEffect,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { WeekInfo, HorseInfo } from 'types';
import {
    LoaderIcon
} from 'lucide-react';
import * as APIs from '@/apis';
import { toast } from 'sonner';

export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedWeekId, setSelectedWeekId] = useState('');
    const [horseNumber, setHorseNumber] = useState('');

    useEffect(() => {
        setHorseNumber(localStorage.getItem('searchHorseNumber') || '');
    }, [])
    useEffect(() => {
        if (weeks.length > 0) {
            console.log('default select change', weeks[0]._id);
            setSelectedWeekId(weeks[0]._id);
        }
    }, [weeks]);


    const searchForHorse = async () => {
        try {
            setIsLoading(true);
            const response = await APIs.searchHorse({
                weekId: selectedWeekId,
                horseNumber,
            })
            const week = response.data?.week as WeekInfo;
            const horse = response.data?.horse as HorseInfo;
            if (horse && week) {
                router.push(`/events/${week.state}/${week._id}/${horse.horseNumber}`);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to search');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className='flex-1 flex justify-center'>
            <div className='w-[500px] max-w-[90vw] flex flex-col gap-5'>
                <img src="/Turnout-for-Horses.jpg" className='w-full' />
                <div>
                    <div className='text-3xl md:text-5xl xl:text-6xl text-center text-main-color'>
                        Hits on the Hudson
                    </div>
                </div>
                <div>
                    <div className='font-bold mb-2'>Week number</div>
                    <Select
                        onValueChange={(value) => { setSelectedWeekId(value) }}
                        defaultValue={selectedWeekId || ''}
                        value={selectedWeekId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select the week' />
                        </SelectTrigger>
                        <SelectContent>
                            {weeks.map((w) => (
                                <SelectItem value={w._id} key={w._id}>
                                    <span>{w.year}</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span>{w.weekNumber}</span>
                                </SelectItem>
                            ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <div className='font-bold mb-2'>Horse number</div>
                    <Input
                        type='text'
                        placeholder='Please enter horse number'
                        value={horseNumber}
                        onChange={(e) => {
                            if (e?.target) {
                                localStorage.setItem('searchHorseNumber', e.target.value);
                                setHorseNumber(e.target.value);
                            }
                        }}
                    />
                </div>
                <Button size='lg' className='bg-main-color font-bold'
                    disabled={!selectedWeekId || !horseNumber || isLoading}
                    onClick={searchForHorse}>
                    {isLoading && (
                        <LoaderIcon size={18}
                            className="animate-[spin_2s_linear_infinite] mr-2" />
                    )}
                    Search
                </Button>
            </div>
        </div>
    )
}
