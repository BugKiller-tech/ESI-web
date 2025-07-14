'use client'; // Required for Next.js App Router

import { useSession } from 'next-auth/react';
import {
    createContext, ReactNode, useContext,
    useEffect, useState,
} from 'react';
import {
    Product,
    CartItem
} from 'types';
import * as APIs from '@/apis';

type AVAILABLE_HORSE_NAMES_FOR_WEEKS = {[key: string]: string[]};

const AvailableHorseContext = createContext<{
    availableHorseNamesForWeeks: AVAILABLE_HORSE_NAMES_FOR_WEEKS,
    setHorsenamesForWeek: (weekId: string, _: string[]) => void,
    getHorsenamesForWeek: (weekId: string) => string[],
}>({
    availableHorseNamesForWeeks: {},
    setHorsenamesForWeek: () => {},
    getHorsenamesForWeek: () => [],
});

export const AvailableHorsesProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();


    const [availableHorseNamesForWeeks, setAvailableHorseNamesForWeeks] = useState<AVAILABLE_HORSE_NAMES_FOR_WEEKS>({});

    const setHorsenamesForWeek = (weekId: string, horseNames: string[]) => {
        setAvailableHorseNamesForWeeks({
            ...availableHorseNamesForWeeks,
            [weekId]: horseNames,
        })
    }

    const getHorsenamesForWeek = (weekId: string): string[] => {
        if(weekId in availableHorseNamesForWeeks) {
            return availableHorseNamesForWeeks[weekId] || [];
        }
        return [];
    }


    return (
        <AvailableHorseContext.Provider value={{
            availableHorseNamesForWeeks,
            setHorsenamesForWeek,
            getHorsenamesForWeek,
        }}>
            {children}
        </AvailableHorseContext.Provider>
    );
};

export const useAvailableHorsesByWeek = () => useContext(AvailableHorseContext);