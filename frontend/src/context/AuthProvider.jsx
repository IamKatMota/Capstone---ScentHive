import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; //decode token to get userid
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    // Get token and role from localStorage if available
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true"); // Convert to boolean
    const [user, setUser] = useState(null); 


    useEffect(() => {
        if (authToken) {
            localStorage.setItem("authToken", authToken); // Store token
            localStorage.setItem("isAdmin", isAdmin); // Store admin status
            try {
                const decoded = jwtDecode(authToken);
                setUser({ id: decoded.id, isAdmin: decoded.is_admin });
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
            }
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("isAdmin");
            setUser(null);
        }
    }, [authToken, isAdmin]);

    //makes authToken available to all children components w/o passing props
    return (
        <AuthContext.Provider value={{ authToken, setAuthToken, isAdmin, setIsAdmin, user }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;