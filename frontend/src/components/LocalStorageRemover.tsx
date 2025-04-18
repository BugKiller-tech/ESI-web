'use client';
import { useEffect } from "react";


export default ({
    storageKey
}: {
    storageKey: string,
}) => {

    useEffect(() => {
        if (storageKey) {
        }
            localStorage.removeItem('cart');
    }, [])

    return (
        <></>
    );
}