'use client';


import { useEffect } from 'react';

function ClientUnloadHandler(): any {

    useEffect(() => {
        if (localStorage.getItem('isRefresh') === 'true') {
            console.log('removing alll~~~~~');
            localStorage.removeItem('searchHorseNumber');
            localStorage.removeItem('searchHorseName');
            localStorage.removeItem('lastActiveTab');
            localStorage.removeItem('isRefresh');
            console.log('storage cleared')
        }


        const handleBeforeUnload = (e: any) => {
            localStorage.setItem('isRefresh', 'true');
            // e.preventDefault();
            // e.returnValue = ''; // this triggers the confirmation dialog
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return null;
}

export default ClientUnloadHandler;