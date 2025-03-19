import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

    useEffect(() => {
        if (authToken) {
            localStorage.setItem("authToken", authToken); // Store token in localStorage
        } else {
            localStorage.removeItem("authToken"); // Remove token on logout
        }
    }, [authToken]);

    //makes authToken available to all children components w/o passing props
    return (
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};