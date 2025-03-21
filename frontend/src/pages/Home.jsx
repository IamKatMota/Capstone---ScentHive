import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import FragranceCard from "../components/FragranceCard";

const Home = () => {
    const [fragrances, setFragrances] = useState([]);
    const [showAll, setShowAll] = useState(false); // Controls "View More"

    // Fetch latest fragrances when the page loads
    useEffect(() => {
        const fetchFragrances = async () => {
            try {
                const response = await api.get("/fragrances");
                // Get current year dynamically
                const currentYear = new Date().getFullYear();

                // Filter fragrances released in the current year
                const newReleases = response.data.filter(fragrance => {
                    return fragrance.launch_date && parseInt(fragrance.launch_date) === currentYear;
                });

                setFragrances(newReleases);
            } catch (error) {
                console.error("Error fetching fragrances:", error);
            }
        };

        fetchFragrances();
    }, []);

    // Slice the array to limit displayed fragrances
    const visibleFragrances = showAll ? fragrances : fragrances.slice(0, 10);

    return (
        <div className="home-container">
            {/* Welcome Section */}
            <header className="hero-section">
                <h1>Welcome to Scent Hive</h1>
                <p>Discover, curate, and build your perfect fragrance wardrobe.</p>
            </header>

            {/* New Releases */}
            <section className="new-releases">
                <h2>New Releases</h2>
                <div className="fragrance-list">
                    {visibleFragrances.length > 0 ? (
                        visibleFragrances.map((fragrance) => (
                            <FragranceCard key={fragrance.id} fragrance={fragrance} />
                        ))
                    ) : (
                        <p>No new releases found.</p>
                    )}
                </div>
                {/* "View More" Button */}
                {fragrances.length > 10 && (
                    <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "Show Less" : "View More"}
                    </button>
                )}
            </section>

            {/* Explore More */}
            {/* <section className="explore-links">
                <h2>Explore More</h2>
                <div>
                    <Link to="/fragrances">Browse All Fragrances</Link> | 
                    <Link to="/profile">Your Collection</Link> | 
                    <Link to="/wishlist">Wishlist</Link>
                </div>
            </section> */}
        </div>
    );
};

export default Home;