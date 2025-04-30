'use client'

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { WeekInfo } from 'types';
import { useRouter } from 'next/navigation';
import * as APIs from '@/apis';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';

interface CellActionProps {
    data: WeekInfo;
}

export default function ({ data }: CellActionProps) {

    const { data: session } = useSession();
    const router = useRouter();

    const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] = useState(false);

    const toggleVisibility = () => {
        const newData = {
            _id: data._id,
            isHided: data.isHided == 1 ? 0 : 1,
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

    const deleteWeekPermanent = async () => {
        const body = {
            _id: data._id,
            isDeleted: 1,
        }
        APIs.updateHorseWeekDeleteState(body, session?.user?.accessToken)
            .then(response => {
                console.log('this is the response', response);
                toast.success('Success');
                router.refresh();
            }
            ).catch(error => {
                console.log('this is the error', error);
                toast.error('Failed');
            }).finally(() => {
                setIsOpenDeleteConfirmModal(false);
            })


    }

    const viewHorses = () => {
        router.push(`/dashboard/weeks/${data._id}/horses`); // Assuming this is the correct route to view horses
    }



    return (
        <div className='flex items-center space-x-2'>
            {data.isDeleted != 1 && <Button size='sm' onClick={() => {
                setIsOpenDeleteConfirmModal(true);
            }}>Delete</Button>}
            <Button size='sm' onClick={toggleVisibility}>{data.isHided ? 'Make visible' : 'Make hidden'}</Button>
            <Button size='sm' onClick={viewHorses}>View horses</Button>

            <Modal
                title='Delete confirm'
                description='Are you sure to delete the week?'
                isOpen={isOpenDeleteConfirmModal}
                onClose={() => {
                    setIsOpenDeleteConfirmModal(false);
                }}>
                {/*  */}
                <div className='flex items-center justify-end space-x-2 pt-6'>
                    <Button variant='destructive' onClick={deleteWeekPermanent}
                        className='flex gap-2 bg-main-color'>
                        Yes, Delete
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
