import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

//instead of manually checking auth in every protected route, ensure only logged in users can access certain pages
const PrivateRoutes = () => {
    const { authToken } = useContext(AuthContext);
    // If user is authenticated, render child components inside <Outlet/>
    // If not, redirect user to the login page
    return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;