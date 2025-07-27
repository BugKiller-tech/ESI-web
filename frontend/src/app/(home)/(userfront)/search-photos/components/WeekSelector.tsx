import { useAtom } from 'jotai';
import {
    selectedWeekIdAtom,
} from '../jotai/atoms';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { WeekInfo } from 'types';

export default ({
    weeks,
}: {
    weeks: WeekInfo[]
}) => {

    const [selectedWeekId, setSelectedWeekId] = useAtom(selectedWeekIdAtom);

    useEffect(() => {
        if (!selectedWeekId && weeks.length > 0) {
            console.log('default select change', weeks[0]._id);
            setSelectedWeekId(weeks[0]._id);
        }
    }, [weeks]);

    return (
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
    )
}