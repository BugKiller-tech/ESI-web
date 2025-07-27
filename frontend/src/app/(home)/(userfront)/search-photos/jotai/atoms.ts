import { atom } from 'jotai'

// Holds selected week ID
export const selectedWeekIdAtom = atom<string>('')

// Holds search string
export const searchAtom = atom<string>('')