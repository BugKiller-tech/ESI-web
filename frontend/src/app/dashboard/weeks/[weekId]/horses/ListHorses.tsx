'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFullScreenLoader } from "@/context/FullScreenLoaderContext";
import * as APIs from '@/apis';
import { toast } from 'sonner';

type compProps = {
    weekId: string;
    horses: string[];
}

export default function ({
    weekId,
    horses,
}: compProps) {

    const router = useRouter();
    const fullScreenLoader = useFullScreenLoader();
    const { data: session } = useSession();
    
    const [
        selectedHorseNumber,
        setSelectedHorseNumber
    ] = useState<string | null>(null);

    
    const viewImagesForHorse = (horseNumber: string) => {
        router.push(`/dashboard/weeks/${weekId}/horses/${horseNumber}`);
    }

    const deleteHorseByNumber = async () => {
        try {
            fullScreenLoader.showLoader();
            const response = await APIs.deleteHorseByAdmin(weekId, selectedHorseNumber, session?.user?.accessToken);
            toast.success('Successfully deleted')
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete');
        } finally {
            fullScreenLoader.hideLoader();
            setSelectedHorseNumber(null);
        }
    }

    return (
        <div className="flex gap-2 md:gap-4 flex-wrap">
            { horses.map((horseNumber) => (
                <Card key={horseNumber} className='lg:min-w-[250px]'>
                    <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
                            <CardTitle>{ horseNumber }</CardTitle>
                            <CardDescription>
                                
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className='px-2 sm:p-6 flex justify-center gap-2'>
                        <Button size='sm' onClick={() => viewImagesForHorse(horseNumber)}>View images</Button>
                        <Button size='sm' className='bg-main-color'
                            onClick={() => setSelectedHorseNumber(horseNumber)}>
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            ))}
            <Modal
                title='Delete confirm'
                description='Are you sure to delete for this horse?'
                isOpen={selectedHorseNumber ? true : false}
                onClose={() => {
                    setSelectedHorseNumber(null);
                }}>
                <div className='text-main-color'>
                    Horse number: { selectedHorseNumber }
                </div>
                <div className='flex items-center justify-end space-x-2 pt-6'>
                    <Button variant='destructive' onClick={deleteHorseByNumber}
                        className='flex gap-2 bg-main-color'>
                        Yes, Delete
                    </Button>
                </div>
            </Modal>
        </div>
    )
}