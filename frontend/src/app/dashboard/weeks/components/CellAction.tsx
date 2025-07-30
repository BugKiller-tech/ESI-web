'use client'

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { WeekInfo } from 'types';
import { useRouter } from 'next/navigation';
import * as APIs from '@/apis';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';
import UploadHorseNamesExcel from './UploadHorseNamesExcel';
import clsx from 'clsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Delete, Ellipsis, Eye, Menu, Sheet, Trash } from 'lucide-react';

interface CellActionProps {
    data: WeekInfo;
}

export default function ({ data }: CellActionProps) {

    const { data: session } = useSession();
    const router = useRouter();

    const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] = useState(false);
    const [isOpenHorseNamesExcelModal, setIsOpenHorseNamesExcelModal] = useState(false);

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
        router.push(`/dashboard/weeks/${data._id}/horses`);
    }

    const gotoManageCandidAwardShotPage = () => {
        router.push(`/dashboard/weeks/${data._id}/manage-candid-award-shots`);
        
    }



    return (
        <div className='flex items-center space-x-2'>
            <Button size='sm' onClick={viewHorses}>View horses</Button>
            <Button size='sm' onClick={gotoManageCandidAwardShotPage}>
                Manage for Candid/Award shots
            </Button>


            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Menu className=''></Menu>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {!data.isDeleted &&
                        <DropdownMenuItem onClick={() => {
                            setIsOpenDeleteConfirmModal(true);
                        }}>
                            <div className='flex items-center gap-2'>
                                <Trash></Trash>
                                <span>Delete</span>
                            </div>
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem onClick={toggleVisibility}>
                        <div className='flex items-center gap-2'>
                            <Eye></Eye>
                            <span>{data.isHided ? 'Make visible' : 'Make hidden'}</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        setIsOpenHorseNamesExcelModal(true);
                    }}>
                        <div className='flex items-center gap-2'>
                            <Sheet></Sheet>
                            <span>Upload horse names XLSX</span>
                        </div>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => { }}>
                        <div className='flex items-center gap-2'>
                            <span>Contact us</span>
                        </div>
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>


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

            <UploadHorseNamesExcel
                week={data}
                isOpened={isOpenHorseNamesExcelModal}
                closeModalAction={() => {
                    setIsOpenHorseNamesExcelModal(false);
                }} />


        </div >
    )
}
