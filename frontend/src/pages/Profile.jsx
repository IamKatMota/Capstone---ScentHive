import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/api";
import { Link } from "react-router-dom";


const listTypes = ["collection", "wishlist", "to_try", "had", "disliked"];

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("collection");
    const [fragrances, setFragrances] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Fetch fragrances for the active tab
    useEffect(() => {

        const fetchFragrances = async () => {
            try {
                const response = await api.get(`/${activeTab}`);
                setFragrances(response.data);
            } catch (error) {
                console.error(`Error loading ${activeTab}:`, error);
                setFragrances([]);
            }
        };
        fetchFragrances();
    }, [activeTab]);

    // Fetch user reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get("/reviews/user");
                setReviews(response.data);
            } catch (error) {
                console.error("Error loading reviews:", error);
            }
        };
        if (user) fetchReviews();
    }, [user]);

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    const handleRemoveFragrance = async (fragranceId) => {
        try {
            await api.delete(`/${activeTab}/${fragranceId}`);
            setFragrances(fragrances.filter((f) => f.id !== fragranceId));
        } catch (error) {
            console.error(`Failed to remove fragrance from ${activeTab}:`, error);
            alert("Could not remove fragrance. Try again.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
                {listTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === type ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {type.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Fragrance List */}
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 gap-4 mb-10">
                {fragrances.length > 0 ? (
                    fragrances.map((f) => (
                        <div key={f.id} className="bg-white shadow rounded-md p-2 text-center relative">
                            <Link to={`/fragrance/${f.id}`}>
                                <img src={f.image || "/placeholder.jpg"} alt={f.name} className="h-40 w-full object-contain mb-2" />
                                <p className="text-sm text-gray-700 font-medium">{f.name}</p>
                            </Link>
                            <button
                                onClick={() => handleRemoveFragrance(f.id)}
                                className="mt-2 text-xs text-red-500 hover:underline"
                            >
                                Remove from {activeTab.replace("_", " ")}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">No fragrances in this list.</p>
                )}
            </div>

            {/* User Reviews */}
            <div className="border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
                {reviews.length > 0 ? (
                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li key={review.id} className="bg-white p-4 rounded-md shadow-md border">
                                <div className="flex justify-between items-center">
                                    <Link to={`/fragrances/${review.fragrance_id}`}>
                                        <h3 className="font-semibold text-gray-800 hover:underline">
                                            {review.fragrance_name || "Fragrance"}
                                        </h3>
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="text-sm mt-2 italic text-gray-700">“{review.content}”</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Rating: {review.rating} ★ — {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You haven’t written any reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;