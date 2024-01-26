import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = async ({ allowedRoles }) => {
    const { auth } = useAuth();
    
    const isAuthorized = auth?.jwt && auth?.role.find(role => allowedRoles.includes(role));
    console.log(auth)
    console.log(isAuthorized)
    return (
        isAuthorized
            ? <Outlet />
            : auth?.jwt
                ? <Navigate to="/unauthorized"/>
                : <Navigate to="/login"/>
    );
}

export default RequireAuth;