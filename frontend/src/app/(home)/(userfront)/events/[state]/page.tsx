import { WeekInfo } from 'types';
import Weeks from './(weeks)/weeks';
import * as APIs from '@/apis'

type pageProps = {
    params: {
        state: string;
    }
}

export default async ({
    params
}: pageProps) => {

    const { state } = await params;
   
    let weeks: WeekInfo[] = [];
    try {
        const response = await APIs.getWeeksByState({
            state
        });
        if (response.data.weeks) {
            console.log(response.data.weeks);
            weeks =  response.data.weeks;
        }
    } catch (error) {
        console.log(error);
    }


    return (
            <Weeks initialWeeks={weeks} />
    )
}