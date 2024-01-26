import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();

    const isAuthorized = auth?.jwt && auth?.role.find(role => allowedRoles.includes(role));
    return (
        isAuthorized
            ? <Outlet />
            : auth?.jwt
                ? <Navigate to="/unauthorized"/>
                : <Navigate to="/login"/>
    );
}

export default RequireAuth;