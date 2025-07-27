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
import {
    useAvailableHorsesByWeek,
} from '@/context/AvailableHorsesContext';
import WeekSelector from './WeekSelector';
import { useAtomValue } from 'jotai';
import { selectedWeekIdAtom } from '../jotai/atoms';


export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {

    const router = useRouter();
    const allAvailableHorseNamesInfo = useAvailableHorsesByWeek();

    const selectedWeekId = useAtomValue(selectedWeekIdAtom)


    const [isLoading, setIsLoading] = useState(false);
    const [horseName, setHorseName] = useState('');
    const [loadingAllHorseNames, setLoadingAllHorseNames] = useState(false);

    const [searchedWeek, setSearchedWeek] = useState<WeekInfo | null>(null);
    const [searchedHorses, setSearchedHorses] = useState<WeekHorseInfo[]>([]);
    const [availableHorseNamesForCurrentWeek, setAvailableHorseNamesForCurrentWeek] = useState<string[]>([]);

    useEffect(() => {
        console.log('reading horse name saved localstorage');
        setHorseName(localStorage.getItem('searchHorseName') || '');
    }, [])
    
    useEffect(() => {
        setHorseName('');
    }, [selectedWeekId])





    useEffect(() => {
        (async () => { // Fetch all horse names
            if (!selectedWeekId) {
                return;
            }
            let horseNames = allAvailableHorseNamesInfo.getHorsenamesForWeek(selectedWeekId);
            console.log('horse names are like like', horseNames);
            if (horseNames.length > 0) {
                setAvailableHorseNamesForCurrentWeek(horseNames);
                return;
            }

            setLoadingAllHorseNames(true);
            const {
                week,
                horses,
            } = await searchForHorseByHorseName('');
            horseNames = horses.map((h: WeekHorseInfo) => {
                return h.horseName
            })
            allAvailableHorseNamesInfo.setHorsenamesForWeek(week._id, horseNames);
            setAvailableHorseNamesForCurrentWeek(horseNames);
            updateHorseNameSelection('');

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

    const updateHorseNameSelection = (name: string) => {
        localStorage.setItem('searchHorseName', name);
        setHorseName(name);

    }


    const viewImages = async (h: WeekHorseInfo) => {
        router.push(`/events/${searchedWeek.state}/${searchedWeek._id}/${h.horseNumber}`);
    }




    return (
        <div className='flex flex-col gap-3'>
            <WeekSelector weeks={weeks} />

            <div>
                <div className='font-bold mb-2'>Horse name</div>
                <div>
                    <SearchableDropdown
                        loading={loadingAllHorseNames}
                        placeholder='Please select the horse name'
                        items={availableHorseNamesForCurrentWeek}
                        value={horseName}
                        onSelect={updateHorseNameSelection} />
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