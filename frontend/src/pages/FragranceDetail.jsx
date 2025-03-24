import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/api";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const FragranceDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [fragrance, setFragrance] = useState(null);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState(""); 

    useEffect(() => {
        const fetchFragrance = async () => {
            try {
                const response = await api.get(`fragrances/${id}`);
                setFragrance(response.data);
            } catch (err) {
                console.error("Error fetching fragrance:", err);
                setError("Fragrance not found.");
            }
        };
        fetchFragrance();
    }, [id]);

    const handleAddToList = async (listType) => {
        try {
            const response = await api.post(`/${listType}`, {
                fragrance_id: fragrance.id,
            });

            setFeedbackMessage(`Fragrance added to your ${listType.replace("_", " ")}!`);
            setFeedbackType("success");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setFeedbackMessage(`Fragrance is already in your ${listType.replace("_", " ")}.`);
                setFeedbackType("error");
            } else {
                console.error(`Error adding to ${listType}:`, error);
                setFeedbackMessage("Something went wrong. Please try again.");
                setFeedbackType("error");
            }
        }
    };

    if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
    if (!fragrance) return <p className="text-center mt-10">Loading...</p>;


    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{fragrance.name}</h1>
                <p className="text-indigo-600 font-semibold mb-4">{fragrance.brand}</p>

                {fragrance.image && (
                    <img
                        src={fragrance.image}
                        alt={fragrance.name}
                        className="w-full h-80 object-contain rounded-lg mb-6 border"
                    />
                )}
                {/* Buttons to add to user lists */}
                {user && (
                    <div className="flex flex-wrap gap-3 mb-4 justify-center">
                        {["collection", "wishlist", "to_try", "had", "disliked"].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleAddToList(type)}
                                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition text-sm"
                            >
                                Add to {type.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                )}

                {/* Feedback message */}
                {feedbackMessage && (
                    <p
                        className={`text-center text-sm mt-2 ${
                            feedbackType === "error" ? "text-red-500" : "text-green-600"
                        }`}
                    >
                        {feedbackMessage}
                    </p>
                )}
                {/* Description */}
                {fragrance.description && (
                    <p className="text-gray-700 mb-4">{fragrance.description}</p>
                )}

                {/* Fragrance Details */}
                <div className="space-y-2 text-gray-700 mb-6">
                    {fragrance.launch_date && (
                        <p><span className="font-semibold">Launch Date:</span> {fragrance.launch_date}</p>
                    )}

                    {fragrance.perfumers?.length > 0 && (
                        <p><span className="font-semibold">Perfumers:</span> {fragrance.perfumers.join(", ")}</p>
                    )}

                    {fragrance.top_notes?.length > 0 && (
                        <p><span className="font-semibold">Top Notes:</span> {fragrance.top_notes.join(", ")}</p>
                    )}

                    {fragrance.heart_notes?.length > 0 && (
                        <p><span className="font-semibold">Heart Notes:</span> {fragrance.heart_notes.join(", ")}</p>
                    )}

                    {fragrance.base_notes?.length > 0 && (
                        <p><span className="font-semibold">Base Notes:</span> {fragrance.base_notes.join(", ")}</p>
                    )}

                    {fragrance.notes?.length > 0 && (
                        <p><span className="font-semibold">Other Notes:</span> {fragrance.notes.join(", ")}</p>
                    )}
                </div>

                {/* Reviews */}
                <div className="border-t pt-6 mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">User Reviews</h2>
                    <ReviewForm fragranceId={id} />
                    <ReviewList fragranceId={id} />
                </div>
            </div>
        </div>
    );
};

export default FragranceDetail;