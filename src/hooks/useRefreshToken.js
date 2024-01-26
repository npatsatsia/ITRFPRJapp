import useAuth from "./useAuth";
import api from '../api/axios';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await api.get('/refresh', {
                withCredentials: true,
            });

            // Update authentication state
            setAuth(prevAuth => ({
                ...prevAuth,
                role: response.data.role,
                jwt: response.data.accessToken,
                username: response.data.username
            }));

            console.log("Authentication state after refresh:", JSON.stringify(prevAuth));
            console.log("New access token:", response.data.accessToken);

            return response.data.accessToken;
        } catch (error) {
            // Handle error or log appropriately
            console.error("Error refreshing token:", error);
            // Throw the error to propagate it further if needed
            throw error;
        }
    };

    return refresh;
}

export default useRefreshToken;
