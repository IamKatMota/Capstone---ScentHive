import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; 
import api from "../api/api";

const Navbar = () => {
    const { authToken, setAuthToken, isAdmin, setIsAdmin } = useContext(AuthContext); 
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    // Logout function: clears token & admin status
    const handleLogout = () => {
        setAuthToken(null);
        setIsAdmin(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        navigate("/login"); // Redirect to login page
    };
    //handle search queries
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        try {
            const response = await api.get(`/fragrances/search?q=${query}`);
            
            setSearchResults(response.data);

        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);

        }
    };

    return (
        <nav>
                {/* 🔍 Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {searchResults.length > 0 && (
                    <div className="search-dropdown">
                        {searchResults.map((fragrance) => (
                            <Link
                                key={fragrance.id}
                                to={`/fragrance/${fragrance.id}`}
                                className="search-result-item"
                            >
                                {fragrance.name} - {fragrance.perfumers}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

                <Link to="/">Home</Link>
                <Link to="/fragrances">Fragrances</Link>

                {!authToken ? ( // Show Login/Register if NOT logged in
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                            <Link to="/profile">Profile</Link>
                        {isAdmin && <Link to="/admin">Admin</Link>} 
                        
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        
                    </>
                )}
        </nav>
    );
};

export default Navbar;