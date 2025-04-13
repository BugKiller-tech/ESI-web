
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { WeekCategory } from '@/constants/data';
import ListHorses from './ListHorses';

import * as APIs from "@/apis";


type pageProps = {
    params: Promise<{
        weekId: string;
    }>
}

export default async function ({ params }: pageProps) {

    const { weekId } = await params;

    let week: WeekCategory | null = null;
    let horses: string[] = [];

    try {
        const response = await APIs.getHorsesByWeekIdAdmin(weekId as string);
        console.log('this is very very', response.data);
        week = response.data.week;
        horses = response.data.horses;
    } catch (error) {
        console.log(error);
    }


    let weekDispName = '';
    if (week) {
        weekDispName = `${week.state} - ${week.year} - ${week.weekNumber}`;
    }

    return (
        <PageContainer scrollable={false}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                <Heading
                    title={`Horses for "${ weekDispName }"`}
                    description='All horses for the above week'
                />
                </div>
                <Separator />
                <ListHorses weekId={weekId} horses={horses} />
            </div>
        </PageContainer>
    )
}