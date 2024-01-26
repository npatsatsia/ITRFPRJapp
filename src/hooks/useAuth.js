import { useContext } from "react";
import authContext from '../Context/authProvider'
const useAuth = () => {
    return useContext(authContext);
}

export default useAuth;