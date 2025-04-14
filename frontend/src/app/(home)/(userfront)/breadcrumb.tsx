'use client'
import {
    usePathname,
    useParams
} from "next/navigation";


export default () => {
    const pathname = usePathname();
    const params = useParams();
    const { state, weekId, horseNumber } = params;

    if (!pathname.startsWith('/events/')) {
        return (
            <div></div>
        )
    }

    return (
        <div className="mt-3 flex items-center gap-2">
            { state && <div>/ { state }</div>}
            { weekId && <div>/ { weekId }</div> }
            { horseNumber && <div>/ { horseNumber }</div> }
        </div>
    )
}