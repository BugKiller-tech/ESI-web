'use client'

import { Button } from '@/components/ui/button';
import { Order } from 'types';
import { useRouter } from 'next/navigation';
import * as APIs from '@/apis';
import { toast } from 'sonner';


interface CellActionProps {
  order: Order;
}

export default function ({ order }: CellActionProps) {

    const router = useRouter();

    const viewOrderDetails = () => {
        router.push(`/dashboard/orders/${ order._id }`);
    }

    return (
        <div>
            <Button className='bg-main-color font-bold' onClick={viewOrderDetails}>
                View
            </Button>
        </div>
    )
}
