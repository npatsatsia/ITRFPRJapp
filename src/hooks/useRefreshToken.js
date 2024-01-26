import useAuth from "./useAuth"
import api from '../api/axios'

const useRefreshToken = () => {
    const {setAuth} = useAuth() 

    const refresh = async () => {
        const response = await api.get('/refresh', {
            withCredentials: true,
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev))
            console.log(response.data.accessToken)
            return {...prev, 
                role: response.data.role, 
                jwt: response.data.accessToken, 
                username: response.data.username
            }
        })
        return response.data.accessToken
    }

  return refresh
}

export default useRefreshToken
