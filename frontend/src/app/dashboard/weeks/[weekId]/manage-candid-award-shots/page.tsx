import { auth } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import * as APIs from "@/apis";
import { toast } from 'sonner';

import ListHorseImages from '../components/ListHorseImages';
import { WeekInfo } from 'types';

type pageProps = {
    params: Promise<{
        weekId: string;
        horseNumber: string;
    }>
}

export default async function ({
    params
}: pageProps) {

    const {
        weekId,
        horseNumber,
    } = await params;
    const session = await auth();


    let horseImages: any[] = [];
    try {
        const response = await APIs.getUnprocessedImagesForCandidAward(weekId, session?.user?.accessToken);
        if (response.data) {
            horseImages = response.data.horseImages;
        }
    } catch (error) {
        console.log(error);
    }

    let week: WeekInfo = null;
    try {
        const response = await APIs.getWeekInfoById(weekId, session?.user?.accessToken);
        if (response.data) {
            week = response.data.week;
        }
    } catch (error) {
        console.log(error);
    }

    let weekDispName = '';
    if (week) {
        weekDispName = `${week.state} - ${week.year} - ${week.weekNumber}`;
    }




    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                    <Heading
                        title={`Manage Candid / Award shots for  "${weekDispName}"`}
                        description='Listing all photos whatever horse # is. If you checked all photos, this page will be empty'
                    />
                </div>
                <Separator />
                {horseImages.length > 0 && (
                    <ListHorseImages
                        week={week}
                        horseImages={horseImages} 
                        isForCandidIdentifying={true} />
                )}

                {
                    horseImages.length == 0 && (
                        <div className='pt-20 flex justify-center text-2xl text-main-color'>
                            All good, no more photos to identify candid/award shots
                        </div>
                    )
                }
            </div>
        </PageContainer>
    )
}
