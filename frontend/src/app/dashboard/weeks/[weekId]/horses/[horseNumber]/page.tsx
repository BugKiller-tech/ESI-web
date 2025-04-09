import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import * as APIs from "@/apis";
import { toast } from 'sonner';

import ListHorseImages from './ListHorseImages';

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


    let horseImages: any[] = [];
    try {
        const response = await APIs.getHorseImagesByHorseNumberForAdmin(weekId, horseNumber);
        if (response.data) {
            horseImages = response.data.horseImages;
        }
    } catch (error) {
        console.log(error);
    }


    return (
        <PageContainer scrollable={true}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                <Heading
                    title={`Horse images for horse number "${ horseNumber }"`}
                    description='Horse images for the above horse number'
                />
                </div>
                <Separator />
                <ListHorseImages horseImages={horseImages} />
            </div>
        </PageContainer>
    )
}