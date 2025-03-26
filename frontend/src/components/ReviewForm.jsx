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
            );
            setSuccess("Review submitted successfully!");
            setContent("");
            setRating(5);
            if (onReviewSubmit) onReviewSubmit(response.data.review); // Callback to refresh reviews
        } catch (err) {
            console.error("Review submission error:", err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("You must be logged in to submit a review.");
            } else {
                setError("Failed to submit review. Please try again.");
            }
        }
    }

        return (
            <main className="w-full flex justify-center items-center py-10 bg-[#f9f5f0]">
                <div className="max-w-3xl w-full bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Leave a Review</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Share your thoughts — your review helps others explore new scents!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="mb-4 col-span-1 md:col-span-3">
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#fdfdfd] rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-rose-300 resize-none"
                                    placeholder="Write your review here..."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="rating" className="text-sm font-medium text-gray-600 block mb-1">
                                    Rating
                                </label>
                                <select
                                    id="rating"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full px-4 py-2 bg-[#fdfdfd] rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-rose-300"
                                >
                                    {[5, 4, 3, 2, 1].map((num) => (
                                        <option key={num} value={num}>
                                            {num} Star{num > 1 && "s"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-rose-500 text-white font-medium rounded-md shadow hover:bg-rose-600 transition"
                            >
                                Post Review →
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        );
    };

    export default ReviewForm;