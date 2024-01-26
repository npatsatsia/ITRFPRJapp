import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";

const RequireAuth = async ({ allowedRoles }) => {
    const refresh = useRefreshToken()
    await refresh()
    const { auth } = useAuth();

    const isAuthorized = auth?.jwt && auth?.role.find(role => allowedRoles.includes(role));
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