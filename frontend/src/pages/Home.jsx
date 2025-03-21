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
        <div>
            {/* Welcome Section */}
            <section
                className="relative h-[100vh] bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: "url('/pexels-yi-ren-57040649-28664164.jpg')" }}
            >
                {/*  Dims the background image */}
                <div className="absolute inset-0 backdrop-brightness-50 backdrop-blur-sm z-0"></div>
                {/*  Text content */}
                <div className="relative z-10 container mx-auto text-center text-white flex flex-col items-center justify-center h-full px-4">
                    <h1 className="text-5xl font-medium mb-6">Welcome to Scent Hive</h1>
                    <p className="text-xl mb-12">
                        Discover, review, and build your fragrance wardrobe with a growing perfume community.
                    </p>
                    <a
                        href="/fragrances"
                        className="bg-indigo-500 text-white py-4 px-12 rounded-full hover:bg-indigo-600"
                    >
                        Explore Fragrances
                    </a>
                </div>
            </section>

            {/* New Releases */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">New Releases</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {visibleFragrances.length > 0 ? (
                            visibleFragrances.map((fragrance) => (
                                <div
                                    key={fragrance.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="h-60 overflow-hidden">
                                        <img
                                            src={fragrance.image || "/default-image.jpg"}
                                            alt={fragrance.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{fragrance.name}</h3>
                                        <p className="text-gray-500">{fragrance.brand}</p>
                                        <Link
                                            to={`/fragrance/${fragrance.id}`}
                                            className="text-indigo-600 hover:underline mt-2 inline-block"
                                        >
                                            Show More →
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-full">No new releases found.</p>
                        )}
                    </div>

                    {fragrances.length > 10 && (
                        <div className="flex justify-center mt-6">
                            <button
                                className="px-6 py-2 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? "Show Less" : "View More"}
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Home;