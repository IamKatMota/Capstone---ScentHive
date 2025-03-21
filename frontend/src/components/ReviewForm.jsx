import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/api";

const ReviewForm = ({ fragranceId, onReviewSubmit }) => {
    const { authToken } = useContext(AuthContext);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await api.post(
                "/reviews",
                { fragrance_id: fragranceId, rating, content },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setSuccess("Review submitted successfully!");
            setContent("");
            setRating(5);
            if (onReviewSubmit) onReviewSubmit(); // Callback to refresh reviews
        } catch (err) {
            console.error(err);
            setError("Failed to submit review. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Rating</label>
                <select
                    className="w-full border px-3 py-2 rounded"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    required
                >
                    {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                            {val} {val === 1 ? "star" : "stars"}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Review</label>
                <textarea
                    className="w-full border px-3 py-2 rounded"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;