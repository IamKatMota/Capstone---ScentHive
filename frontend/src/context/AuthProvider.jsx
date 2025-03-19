import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    // Get token and role from localStorage if available
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true"); // Convert to boolean

    useEffect(() => {
        if (authToken) {
            localStorage.setItem("authToken", authToken); // Store token
            localStorage.setItem("isAdmin", isAdmin); // Store admin status
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("isAdmin");
        }
    }, [authToken, isAdmin]);

    //makes authToken available to all children components w/o passing props
    return (
        <AuthContext.Provider value={{ authToken, setAuthToken, isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;