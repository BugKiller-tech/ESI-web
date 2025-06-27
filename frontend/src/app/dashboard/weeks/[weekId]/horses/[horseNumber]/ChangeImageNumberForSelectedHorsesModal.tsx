'use client';

import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
    useRouter,
    useParams
} from "next/navigation";
import { useEffect, useState } from "react";

import * as APIs from '@/apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";

type compProps = {
    hideModalAction: (isDeleted: boolean) => void,
    selectedHorseImageIds: string[],
}

export default ({
    hideModalAction,
    selectedHorseImageIds
}: compProps) => {

    const { data: session } = useSession();
    const params = useParams();
    const { state, weekId, horseNumber } = params;
    const router = useRouter();
    const fullScreenLoader = useFullScreenLoader();

    const [newHorseNumber, setNewHorseNumber] = useState<string>('');

    const [horseNumbers, setHorseNumbers] = useState<string[]>([]);

    useEffect(() => {
        const fetchHorseNumbers = async () => {
            try {
                console.log('weekid is like', weekId);
                const response = await APIs.getHorsesByWeekIdAdmin(weekId as string, session?.user?.accessToken);
                const horseNumbers: string[] = response.data.horses || [];
                console.log('fetched horse numbers from api', horseNumbers);
                setHorseNumbers(horseNumbers);
            } catch (error) {
                console.log(error);
            }
        }
        if (horseNumbers.length == 0) {
            fetchHorseNumbers();
        }
    }, []);



    const changeHorseNumberAction = async () => {
        try {
            const postData = {
                newHorseNumber,
                horseImageIds: selectedHorseImageIds,
            }
            fullScreenLoader.showLoader();
            const response = await APIs.changeHorseNumberForImages(postData, session?.user?.accessToken);
            if (response.data) {
                toast.success('Successfully changed the horse number');
                hideModalAction(true);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to change the horser number for selected images');
        } finally {
            fullScreenLoader.hideLoader();
        }

    }

    return (
        <Modal
            title='Change horse number for selected images'
            description='Please select correct horse number to change.'
            isOpen={true}
            onClose={() => {
                hideModalAction(false);
            }}>
            {/*  */}
            <div className='flex flex-col gap-3'>
                <div className='font-bold text-main-color'>
                    Selected images count: { selectedHorseImageIds.length }
                </div>
                <div className='font-bold text-main-color'>
                    Current horse number: {horseNumber}
                </div>

                <div>
                    <div className='mb-2 font-bold text-main-color'>New horse number:</div>                    
                    <Select
                        onValueChange={(value) => { setNewHorseNumber(value) }}
                        defaultValue={newHorseNumber || ''}
                        value={newHorseNumber}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Select hosre number you want' />
                        </SelectTrigger>
                        <SelectContent>
                            {horseNumbers.map((name) => (
                                <SelectItem value={name} key={name}>
                                    <span>{name}</span>
                                </SelectItem>
                            ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center justify-end space-x-2 pt-6'>
                    <Button variant='destructive' onClick={changeHorseNumberAction}
                        className='flex gap-2 bg-main-color'
                        disabled={!newHorseNumber || newHorseNumber == horseNumber}>
                        Change
                    </Button>
                </div>
            </div>
        </Modal>
    )
}