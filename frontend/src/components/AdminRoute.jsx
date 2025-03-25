import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminRoute = () => {
    const { user } = useContext(AuthContext);

    if (user === null) {
        return <p className="text-center mt-10">Loading...</p>;
    }    

    return user?.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;