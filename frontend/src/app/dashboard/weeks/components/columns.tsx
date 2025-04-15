'use client';
import { WeekInfo } from 'types';
import { ColumnDef } from '@tanstack/react-table';
import CellAction from './CellAction';

export const columns: ColumnDef<WeekInfo>[] = [
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