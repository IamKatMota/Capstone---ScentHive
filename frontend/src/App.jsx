import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import PrivateRoutes from "./components/PrivateRoutes";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Fragrances from "./pages/Fragrances"; // Page that lists all fragrances
import FragranceDetail from "./pages/FragranceDetail"; // Page for individual fragrance
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/NavBar";



function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/fragrances" element={<Fragrances />} />
                    <Route path="/fragrance/:id" element={<FragranceDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Protected Routes (login required) */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    {/* Protect admin-only routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>

    );
}

export default App;
