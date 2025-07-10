'use client';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HorseImageInfo, WeekInfo } from 'types';
import * as APIs from '@/apis';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';


export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedWeekId, setSelectedWeekId] = useState('');
    const [horseNumber, setHorseNumber] = useState('');
    const router = useRouter();

    useEffect(() => {
        setHorseNumber(localStorage.getItem('searchHorseNumber') || '');
    }, [])
    useEffect(() => {
        if (weeks.length > 0) {
            console.log('default select change', weeks[0]._id);
            setSelectedWeekId(weeks[0]._id);
        }
    }, [weeks]);

    const searchForHorseByHorseNumber = async () => {
        try {
            setIsLoading(true);
            const response = await APIs.searchHorseByNumber({
                weekId: selectedWeekId,
                horseNumber,
            })
            const week = response.data?.week as WeekInfo;
            const horse = response.data?.horse as HorseImageInfo;
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
        <div className='flex flex-col gap-3'>
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
            <Button size='lg' className='bg-main-color font-bold text-2xl'
                disabled={!selectedWeekId || !horseNumber || isLoading}
                onClick={searchForHorseByHorseNumber}>
                {isLoading && (
                    <LoaderIcon size={18}
                        className="animate-[spin_2s_linear_infinite] mr-2" />
                )}
                Search
            </Button>
        </div>
    )
}