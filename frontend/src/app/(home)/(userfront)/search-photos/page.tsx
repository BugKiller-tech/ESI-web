import { auth } from '@/lib/auth';
import { WeekInfo } from 'types';
import * as APIs from '@/apis'
import SearchForm from './search-form';

export default async () => {
    const session = await auth();

    let weeks: WeekInfo[] = [];
    try {
        const state = 'NY'; // for now we will only consider NY ignore FL
        const response = await APIs.getWeeksByState({
            state
        }, session?.user?.accessToken);
        if (response.data.weeks) {
            console.log(response.data.weeks);
            weeks = response.data.weeks;
        }
    } catch (error) {
        console.log(error);
    }


    return (
        <SearchForm weeks={weeks} />
    )
}