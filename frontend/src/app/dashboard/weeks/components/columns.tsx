'use client';
import { WeekCategory } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './CellAction';

export const columns: ColumnDef<WeekCategory>[] = [
    {
        accessorKey: 'state',
        header: 'State',
    },
    {
        accessorKey: 'year',
        header: 'Year',
    },
    {
        accessorKey: 'weekNumber',
        header: 'Week Number',
    },
    {
        accessorKey: 'isDeleted',
        header: 'Is visible',
        cell: ({ row }) => {
            return row.getValue('isDeleted') ? 'No' : 'Yes';
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];