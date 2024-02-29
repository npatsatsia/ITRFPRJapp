import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRole }) => {
    const { auth } = useAuth();
    
    const isAuthorized = auth?.jwt && auth?.role.find(role => allowedRole === role);
    
    return (
        isAuthorized
            ? <Outlet />
            : auth?.jwt
                ? <Navigate to="/unauthorized"/>
                : <Navigate to="/login"/>
    );
}

export default RequireAuth;