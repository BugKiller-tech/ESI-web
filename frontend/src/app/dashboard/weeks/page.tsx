import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

import ListWeeks from './components/ListWeeks';

import { SearchParams } from 'nuqs/server';
import { searchParamsCache, serialize } from '@/lib/searchparams';



type pageProps = {
    searchParams: Promise<SearchParams>;
};

export default async function (props: pageProps) {

    const searchParams = await props.searchParams;
    // Allow nested RSCs to access the search params (in a type-safe way)
    searchParamsCache.parse(searchParams);

    // This key is used for invoke suspense if any of the search params changed (used for filters).
    const key = serialize({ ...searchParams });

    return (
        <PageContainer scrollable={false}>
            <div className='flex flex-1 flex-col space-y-4'>
                <div className='flex items-start justify-between'>
                <Heading
                    title='All Weeks'
                    description='Manage weeks here'
                />
                </div>
                <Separator />
                <Suspense
                    key={key}
                    fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                    <ListWeeks />
                </Suspense>
            </div>
        </PageContainer>
    )
}