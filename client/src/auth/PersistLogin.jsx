import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom"
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken';
import Loading from '../components/subcomponents/Loading'

const PersistLogin = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                // Add a 5 second timeout safety net
                const timeout = setTimeout(() => {
                    if (isMounted) setIsLoading(false);
                }, 5000);

                await refresh();
                clearTimeout(timeout);
            }
            catch (err) {
                console.log("Auto-login failed:", err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    return (
        isLoading
            ? <Loading />
            : <Outlet />
    )
}

export default PersistLogin