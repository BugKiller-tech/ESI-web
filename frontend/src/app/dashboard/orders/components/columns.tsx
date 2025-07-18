'use client';
import { Order } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import CellActions from './CellActions';
import OrderStatus from '@/components/esi/OrderStatus';

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: '_id',
        header: 'Order Id'
    },
    {
        accessorKey: 'orderedAt',
        header: 'Ordered at',
        cell: ({ row }) => {
            const d = row.getValue('orderedAt');
            return d ? format(parseISO(d as string), 'yyyy-MM-dd HH:mm:ss') : 'No date'
        }
    },
    // {
    //     accessorKey: 'firstName',
    //     header: 'First Name',
    // },
    // {
    //     accessorKey: 'lastName',
    //     header: "Last Name",
    // },
    {
        accessorKey: 'email',
        header: "Email",
    },
    // {
    //     accessorKey: 'firstName',
    //     header: 'First name'
    // },
    // {
    //     accessorKey: 'lastName',
    //     header: 'Last name'
    // },
    {
        accessorKey: 'fullName',
        header: 'Full name'
    },
    {
        accessorKey: 'paymentStatus',
        header: 'Payment status'
    },
    {        
        accessorKey: 'subTotal',
        header: 'Sub total',
    },
    {
        accessorKey: 'paidTotal',
        header: 'Paid total',
    },
    {
        accessorKey: 'orderStatus',
        header: 'Order status',
        cell: ({ row }) => {
            return <OrderStatus orderStatus={row.getValue('orderStatus')} />
        }
    },
    {
        accessorKey: '',
        header: 'Action',
        cell: ({ row }) => {
            return <CellActions order={row.original} />
        }
    }
    // {
    //     accessorKey: 'isDeleted',
    //     header: 'Is visible',
    //     cell: ({ row }) => {
    //         return row.getValue('isDeleted') ? 'No' : 'Yes';
    //     }
    // },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <CellAction data={row.original} />
    // }
];