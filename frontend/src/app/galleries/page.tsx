import { WeekInfo } from 'types';
import Weeks from './(weeks)/index';

export default async () => {
   
    const getWeeks = async() : Promise<WeekInfo[]> => {
        return [
            { name: 'week1', },
            { name: 'week2', },
            { name: 'week3', },
            { name: 'week4', },
            { name: 'week5', },
            { name: 'week6', },
            { name: 'week7', },
            { name: 'week8', },
            { name: 'week9', },
            { name: 'week10', },
            { name: 'week11', },
            { name: 'week12', },
            { name: 'week13', },
            { name: 'week14', },
            { name: 'week15', },
        ]
        // return new Promise((resolve, reject) => {
        //     // resolve([{ name: 'test for it' }])
        //     reject('asdfasdf')
        // })
    }
    const weeks = await getWeeks();
    return (
        <div>
            <Weeks initialWeeks={weeks} />
        </div>
    )
}