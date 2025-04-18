'use client'
import {
    usePathname,
    useParams,
    useRouter,
} from "next/navigation";
import { useState } from "react";
import { Modal } from '@/components/ui/modal';
import { Button } from "@/components/ui/button";


export default () => {
    const pathname = usePathname();
    const params = useParams();
    const { state, weekId, horseNumber } = params;
    const router = useRouter();

    const [isOpenedStateModal, setIsOpenedStateModal] = useState(false);

    if (!pathname.startsWith('/events/')) {
        return (
            <div></div>
        )
    }

    return (
        <div className="mt-3 flex items-center gap-2">
            { state && <div className="cursor-pointer font-bold text-main-color underline"
                            onClick={() => {
                                setIsOpenedStateModal(!isOpenedStateModal)
                            }
                        }>/ { state }</div>}
            { weekId && <div className="cursor-pointer">/ { weekId }</div> }
            { horseNumber && <div className="cursor-pointer">/ { horseNumber }</div> }


            <Modal
                title='Select the state'
                description='YOu can switch the state to see events for the state'
                isOpen={isOpenedStateModal}
                onClose={() => {
                    setIsOpenedStateModal(false);
                }}
            >
                <div className='flex flex-col gap-2'>
                    <Button disabled={state == 'NY'} className="bg-main-color"
                        onClick={() => {
                            router.push('/events/NY')
                            setIsOpenedStateModal(false);
                        }}
                    >HITS Saugerties, NY</Button>
                    <Button disabled={state == 'FL'} className="bg-main-color"
                        onClick={() => {
                            router.push('/events/FL');
                            setIsOpenedStateModal(false);
                        }}
                    >HITS Ocala, FL</Button>
                </div>
            </Modal>
        </div>
    )
}