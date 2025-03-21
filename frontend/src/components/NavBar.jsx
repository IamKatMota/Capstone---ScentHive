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
        <header className='flex border-b py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide relative z-50'>
            <div className='flex flex-wrap items-center gap-4 w-full'>

                <Link to="/">
                    <h3 className="text-2xl font-semibold">Scent Hive</h3>
                </Link>

                {/* Nav Menu */}
                <div className="hidden lg:flex flex-auto ml-12">
                    <ul className="flex gap-x-8">
                        <li><Link to="/" className="hover:text-blue-600 font-bold">Home</Link></li>
                        <li><Link to="/fragrances" className="hover:text-blue-600 font-bold">Fragrances</Link></li>
                        {authToken && <li><Link to="/profile" className="hover:text-blue-600 font-bold">Profile</Link></li>}
                        {authToken && isAdmin && <li><Link to="/admin" className="hover:text-blue-600 font-bold">Admin</Link></li>}
                    </ul>
                </div>

                {/* 🔍 Search Bar */}
                <div className="relative w-full max-w-sm mx-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="border px-3 py-1.5 rounded w-full"
                    />
                    {searchResults.length > 0 && (
                        <div className="absolute bg-white border mt-1 w-full z-50 shadow max-h-60 overflow-y-auto">
                            {searchResults.map((fragrance) => (
                                <Link
                                    key={fragrance.id}
                                    to={`/fragrance/${fragrance.id}`}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    {fragrance.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="ml-auto flex items-center space-x-4">
                    {!authToken ? (
                        <>
                            <Link to="/login" className="hover:text-blue-600 font-bold">Login</Link>
                            <Link to="/register">
                                <button className="px-4 py-2 text-sm font-bold text-white border-2 border-blue-800 bg-blue-800 rounded hover:bg-transparent hover:text-blue-800 transition-all">
                                    Register
                                </button>
                            </Link>
                        </>
                    ) : (
                        <span className="text-gray-600 font-semibold">Welcome back!</span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;