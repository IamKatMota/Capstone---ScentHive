import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext"; // 
import api from "../api/api";

const Login = () => {
    const { setAuthToken, setIsAdmin } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/login", { email, password }); 
            const { token, isAdmin } = response.data;

            setAuthToken(token);
            setIsAdmin(isAdmin);
        } catch (error) {
            setError("Invalid credentials", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}        
        </div>
    );
};

export default Login;