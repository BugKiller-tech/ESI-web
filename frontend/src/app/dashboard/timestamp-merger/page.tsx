import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

import { SearchParams } from 'nuqs/server';
import { searchParamsCache, serialize } from '@/lib/searchparams';

import TimestampJsonMerger from './TimestampJsonMerger';

type pageProps = {
};

export default async function (props: pageProps) {

    return (
        <PageContainer scrollable={false}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                <Heading
                    title='Timestamp json merger'
                    description='You can merge the timestamp here'
                />
                </div>
                <Separator />

                <TimestampJsonMerger />
                
            </div>
        </PageContainer>
    )
}