'use client';

import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
    useRouter,
    useParams
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import * as APIs from '@/apis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import clsx from 'clsx';
import {
    HORSE_NUMBER_INPUT,
    CANDID_PREFIX,
    AWARD_PREFIX,

    SPECIAL_SHOT_FOLDERS,
} from '@/constants/esi-constants';
import { WeekInfo } from 'types';

type compProps = {
    week: WeekInfo,
    hideModalAction: (isDeleted: boolean) => void,
    selectedHorseImageIds: string[],
}

export default ({
    week,
    hideModalAction,
    selectedHorseImageIds
}: compProps) => {

    const { data: session } = useSession();
    const params = useParams();
    const { state, weekId, horseNumber } = params;
    const router = useRouter();
    const fullScreenLoader = useFullScreenLoader();

    const [horseNumberType, setHorseNumberType] = useState(HORSE_NUMBER_INPUT); // HORSE_NUMBER_INPUT, CANDID_PREFIX, AWARD_PREFIX
    const [newHorseNumber, setNewHorseNumber] = useState<string>('');
    const [selectedSubWeek, setSelectedSubWeek] = useState('');

    const specialHorseType = [CANDID_PREFIX, AWARD_PREFIX];

    useEffect(() => {
        // fetch available horse numbers if it's needed later and udpate horseNumbers state
    }, []);

    useEffect(() => {
        if (specialHorseType.includes(horseNumberType)) {
            setNewHorseNumber(horseNumberType);
        } else {
            setNewHorseNumber('');
        }
    }, [horseNumberType]);

    const availableFolders = useMemo(() => {
        let options = [];

        const startEnd = SPECIAL_SHOT_FOLDERS[week?.weekNumber];
        if (startEnd) {
            const {
                start, end
            } = startEnd;
            for (let i = start; i <= end; i++) {
                options.push(`Wk${i}`);
            }
        }
        return options;
    }, [week]);


    const computedHorseNumber = useMemo(() => {
        if (horseNumberType == HORSE_NUMBER_INPUT) {
            return newHorseNumber
        }
        return `${horseNumberType} ${selectedSubWeek}`
    }, [horseNumberType, newHorseNumber, selectedSubWeek])

    const isAllInfoSelected = useMemo(() => {
        if (horseNumberType == HORSE_NUMBER_INPUT) {
            return newHorseNumber && newHorseNumber != horseNumber
        } else {
            return horseNumberType && selectedSubWeek
        }
        
    }, [horseNumberType, newHorseNumber, selectedSubWeek])



    const changeHorseNumberAction = async () => {
        try {
            const postData = {
                newHorseNumber: computedHorseNumber.trim(),
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
                    Selected images count: {selectedHorseImageIds.length}
                </div>
                <div className='font-bold text-main-color'>
                    Current horse number: {horseNumber}
                </div>


                <div>
                    <div className='mb-2 font-bold text-main-color'>New horse number: {computedHorseNumber}</div>
                    <div className='flex gap-3 mb-3'>
                        <Button
                            onClick={() => { setHorseNumberType(HORSE_NUMBER_INPUT) }}
                            className={clsx(horseNumberType == HORSE_NUMBER_INPUT && 'bg-main-color')}>Horse number</Button>
                        <Button
                            onClick={() => { setHorseNumberType(CANDID_PREFIX) }}
                            className={clsx(horseNumberType == CANDID_PREFIX && 'bg-main-color')}>Candid shots</Button>
                        <Button
                            onClick={() => { setHorseNumberType(AWARD_PREFIX) }}
                            className={clsx(horseNumberType == AWARD_PREFIX && 'bg-main-color')}>Award shots</Button>
                    </div>
                    {
                        horseNumberType == HORSE_NUMBER_INPUT ? (

                            <Input type="text" placeholder='Please enter the correct horse number for the selected images'
                                value={newHorseNumber} onChange={(e) => {
                                    setNewHorseNumber(e.target.value);
                                }} />
                        ) : (
                            <Select
                            value={selectedSubWeek}
                            onValueChange={(val) => setSelectedSubWeek(val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Please select specific week'></SelectValue>
                                    <SelectContent>
                                        {
                                            availableFolders.map(item => (
                                                <SelectItem value={item} key={item}>
                                                    {item}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </SelectTrigger>
                            </Select>
                        )
                    }

                    {/* <Select
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
                    </Select> */}
                </div>
                <div className='flex items-center justify-end space-x-2 pt-6'>
                    <Button variant='destructive' onClick={changeHorseNumberAction}
                        className='flex gap-2 bg-main-color'
                        disabled={!isAllInfoSelected}>
                        Change
                    </Button>
                </div>
            </div>
        </Modal>
    )
}