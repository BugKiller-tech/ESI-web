'use client';
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { WeekInfo } from "types"
import { selectedWeekIdAtom } from "../jotai/atoms"
import WeekSelector from "./WeekSelector"
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import * as APIs from '@/apis';
import { useRouter } from 'next/navigation';
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import clsx from 'clsx';

export default ({
    weeks
}: {
    weeks: WeekInfo[]
}) => {
    const router = useRouter();


    const selectedWeekId = useAtomValue(selectedWeekIdAtom)

    const [isLoading, setIsLoading] = useState(false);
    const [searchedWeek, setSearchedWeek] = useState<WeekInfo | null>(null);
    const [searchedHorseNames, setSearchedHorseNames] = useState<string[]>([]);


    const viewImages = (hNum: string) => {
        router.push(`/events/${searchedWeek.state}/${searchedWeek._id}/${hNum}`);
    }


    const searchForCandidAndAwardHorses = async () => {
        try {
            setIsLoading(true);
            const response = await APIs.searchCandidAndAwardHorses({
                weekId: selectedWeekId,
            })
            const week = response.data?.week as WeekInfo;
            const horses = response.data?.horseNames as string[];

            setSearchedWeek(week);
            setSearchedHorseNames(horses);

            if (horses.length == 0) {
                toast.error('No candid or award shots available yet.')
            }
        } catch (error: any) {
        } finally {
            setIsLoading(false);
        }

    }


    return (
        <div className='flex flex-col gap-3'>
            <WeekSelector weeks={weeks} />
            {/* <Button className='flex-grow' onClick={() => {

            }}>Candid shots</Button>
            <Button className='flex-grow' onClick={() => { }}>Award shots</Button> */}

            <Button size='lg' className='bg-main-color font-bold text-2xl'
                disabled={!selectedWeekId || isLoading}
                onClick={searchForCandidAndAwardHorses}>
                {isLoading && (
                    <LoaderIcon size={18}
                        className="animate-[spin_2s_linear_infinite] mr-2" />
                )}
                Search
            </Button>




            <Modal
                title='Candid & Award shots available'
                description='Please select one to see photos'
                isOpen={searchedHorseNames.length > 0}
                onClose={() => {
                    setSearchedHorseNames([]);
                }}>
                {/*  */}
                <div className='flex flex-col gap-3'>
                    <h2 className="text-2xl font-bold mb-4">
                        Please select one to see photos ( {searchedHorseNames.length} found )
                    </h2>
                    <ul className="space-y-3 max-h-[500px] overflow-y-auto">
                        {searchedHorseNames.map(h => (
                            <div key={h}
                                className={clsx('shadow-sm rounded-xl px-5 py-3 text-white text-lg',
                                    'font-medium border hover:shadow-md transition cursor-pointer',
                                    'hover:bg-slate-400',
                                    h.toLowerCase().startsWith('award') && 'bg-red-500',
                                    h.toLowerCase().startsWith('candid') && 'bg-green-500',
                                )}
                                onClick={() => {
                                    viewImages(h);
                                }}>
                                {h}
                            </div>
                        ))}

                    </ul>
                </div>
            </Modal>
        </div>
    )
}