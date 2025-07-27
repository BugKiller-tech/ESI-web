export const availableWeekNumbers = {
    'FL': [
        'Wk1-12',
    ],
    'NY': [
        'Festival of The Horse',
        'Wk1-3',
        'Wk4-6',
        'Wk7-9',
        'Wk10-12',
    ],
}

export type StateType = 'FL' | 'NY'


export const SPECIAL_SHOT_FOLDERS: {
    [key: string]: {
        start: number,
        end: number,
    }
} = {
    'Festival of The Horse': { start: 1, end: 1, },
    'Wk1-3': { start: 1, end: 3, },
    'Wk4-6': { start: 4, end: 6, },
    'Wk7-9': { start: 7, end: 9, },
    'Wk10-12': { start: 10, end: 12, },
    'Wk1-12': { start: 1, end: 12, },
}

export const HORSE_NUMBER_INPUT = 'horseNumber';
export const CANDID_PREFIX = 'Candid';
export const AWARD_PREFIX = 'Award';