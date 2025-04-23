'use client'

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { WeekInfo } from 'types';
import { useRouter } from 'next/navigation';
import * as APIs from '@/apis';
import { toast } from 'sonner';

interface CellActionProps {
  data: WeekInfo;
}

export default function ({ data }: CellActionProps) {

    const { data: session } = useSession();
    const router = useRouter();

    const toggleVisibility = () => {
        const newData = {
            _id: data._id,
            isDeleted: data.isDeleted == 1 ? 0 : 1,
        }
        APIs.updateHorseWeekVisibility(newData, session?.user?.accessToken)
        .then(response => {
            console.log('this is the response', response);
            toast.success('Visibility updated successfully');
            router.refresh();
        }
        ).catch(error => {
            console.log('this is the error', error);
            toast.error('Failed to update visibility');
        })
    }

    const viewHorses = () => {
        router.push(`/dashboard/weeks/${data._id}/horses`); // Assuming this is the correct route to view horses
    }



    return (
        <div className='flex items-center space-x-2'>
            <Button size='sm'>Delete</Button>
            <Button size='sm' onClick={toggleVisibility}>{ data.isDeleted ? 'Make visible' : 'Make hidden' }</Button>
            <Button size='sm' onClick={viewHorses}>View horses</Button>
        </div>
    )
}
