import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh  = useRefreshToken()
    const {auth, persist} = useAuth()
    console.log(auth)

    useEffect(() => {
        let isMounted = true
        const verifyRefreshToken = async () => {
            try{
                await refresh()
            }catch(error){
                console.error(error)
            }finally{
                isMounted && setIsLoading(false)
                setIsLoading(false)
            }
        }
        !auth?.jwt ? verifyRefreshToken() : setIsLoading(false)


        return () => isMounted = false
    }, [])


    return (
        <>
            {isLoading? <div>Loading...</div> : <Outlet/>}
        </>
    )
}

export default PersistLogin