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
import { HorseImageInfo, WeekInfo, WeekHorseInfo } from 'types';
import * as APIs from '@/apis';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import SearchableDropdown from './SearchableDropdown';


export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedWeekId, setSelectedWeekId] = useState('');
    const [horseName, setHorseName] = useState('');
    const [loadingAllHorseNames, setLoadingAllHorseNames] = useState(false);
    const [availableHorseNames, setAvailableHorseNames] = useState([]);

    const [searchedWeek, setSearchedWeek] = useState<WeekInfo | null>(null);
    const [searchedHorses, setSearchedHorses] = useState<WeekHorseInfo[]>([]);

    useEffect(() => {
        console.log('reading horse name saved localstorage');
        setHorseName(localStorage.getItem('searchHorseName') || '');
    }, [])
    useEffect(() => {
        if (weeks.length > 0) {
            console.log('default select change', weeks[0]._id);
            setSelectedWeekId(weeks[0]._id);
        }
    }, [weeks]);

    useEffect(() => {
        (async () => { // Fetch all horse names
            if (!selectedWeekId) {
                return;
            }
            setLoadingAllHorseNames(true);
            const {
                week,
                horses,
            } = await searchForHorseByHorseName('');
            setAvailableHorseNames(horses.map((h: WeekHorseInfo) => {
                return h.horseName
            }))
            setLoadingAllHorseNames(false);

        })();
    }, [selectedWeekId])

    const searchForHorseByHorseName = async (horseNameToSearch: string) => {
        try {
            const response = await APIs.searchHorsesByName({
                weekId: selectedWeekId,
                horseNameToSearch: horseNameToSearch,
            })
            const week = response.data?.week as WeekInfo;
            const horses = response.data?.horses as WeekHorseInfo[];
            return {
                week,
                horses,
            }
        } catch (error: any) {
        }

    }
    const searchForMatchingHorsesAction = async () => {
        try {
            setIsLoading(true);
            const {
                week,
                horses,
            } = await searchForHorseByHorseName(horseName);
            setSearchedWeek(week);
            setSearchedHorses(horses);
            if (horses.length == 0) {
                toast.success('No horse found');
            }
            // if (horse && week) {
            //     router.push(`/events/${week.state}/${week._id}/${horse.horseNumber}`);
            // }

        } catch (error: any) {
            toast.error(error?.message || 'Failed to search');
        } finally {
            setIsLoading(false);
        }
    }


    const viewImages = async (h: WeekHorseInfo) => {
        router.push(`/events/${searchedWeek.state}/${searchedWeek._id}/${h.horseNumber}`);
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
                <div className='font-bold mb-2'>Horse name</div>
                <div>
                    <SearchableDropdown
                        loading={loadingAllHorseNames}
                        placeholder='Please select the horse name'
                        items={availableHorseNames}
                        value={horseName}
                        onSelect={setHorseName} />
                </div>
                {/* <Input
                    type='text'
                    placeholder='Please enter horse name'
                    value={horseName}
                    onChange={(e) => {
                        if (e?.target) {
                            localStorage.setItem('searchHorseName', e.target.value);
                            setHorseName(e.target.value);
                        }
                    }}
                /> */}
            </div>
            <Button size='lg' className='bg-main-color font-bold text-2xl'
                disabled={!selectedWeekId || !horseName || isLoading}
                onClick={searchForMatchingHorsesAction}>
                {isLoading && (
                    <LoaderIcon size={18}
                        className="animate-[spin_2s_linear_infinite] mr-2" />
                )}
                Search
            </Button>


            <Modal
                title='Horses found by searching horse name'
                description='Please select one horse to see images'
                isOpen={searchedHorses.length > 0}
                onClose={() => {
                    setSearchedHorses([]);
                }}>
                {/*  */}
                <div className='flex flex-col gap-3'>
                    <h2 className="text-2xl font-bold mb-4">
                        🐎 Horse Names
                        ( {searchedHorses.length} horses found )
                    </h2>
                    <ul className="space-y-3 max-h-[500px] overflow-y-auto">
                        {searchedHorses.map(h => (
                            <div key={h._id}
                                className="bg-white shadow-sm rounded-xl px-5 py-3 text-gray-800 text-lg
                                font-medium border hover:shadow-md transition cursor-pointer
                                hover:bg-slate-400"
                                onClick={() => {
                                    viewImages(h);
                                }}>
                                {h.horseName}
                            </div>
                        ))}

                    </ul>
                </div>
            </Modal>
        </div>
    )
}