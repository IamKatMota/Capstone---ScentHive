import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; 

const Navbar = () => {
    const { authToken, setAuthToken, isAdmin, setIsAdmin } = useContext(AuthContext); 
    const navigate = useNavigate();

    // Logout function: clears token & admin status
    const handleLogout = () => {
        setAuthToken(null);
        setIsAdmin(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>

                {!authToken ? ( // Show Login/Register if NOT logged in
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li> 
                        {isAdmin && <li><Link to="/admin">Admin</Link></li>} 
                        <li>
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;