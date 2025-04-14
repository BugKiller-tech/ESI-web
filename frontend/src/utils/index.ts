export const containsAllWords = (str: string, term: string) => {
    const words = term.trim().toLowerCase().split(/\s+/);
    const lowerStr = str.toLowerCase();
    return words.every(word => lowerStr.includes(word));
}
