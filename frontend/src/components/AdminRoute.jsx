import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminRoute = () => {
    const { authToken, isAdmin } = useContext(AuthContext);
    
    if (!authToken) {
        return <Navigate to="/login" />; // Redirect if not logged in
    }
    
    return isAdmin ? <Outlet /> : <Navigate to="/" />; // Redirect non-admins to home
};

export default AdminRoute;