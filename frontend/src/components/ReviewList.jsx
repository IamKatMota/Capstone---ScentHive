import { useEffect, useState } from "react";
import api from "../api/api";

const ReviewList = ({ fragranceId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/${fragranceId}`);
                setReviews(response.data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [fragranceId]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i
                key={i}
                className={`bi ${i < rating ? "bi-star-fill text-yellow-500" : "bi-star text-gray-300"} text-xl`}
            ></i>
        ));
    };

    if (loading) return <p className="text-gray-500 mt-4">Loading reviews...</p>;
    if (error) return <p className="text-red-500 mt-4">{error}</p>;
    if (reviews.length === 0) return <p className="text-gray-600 mt-4">No reviews yet. Be the first!</p>;

    return (
        <div className="flex flex-wrap gap-6 mt-8 justify-center">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="w-96 bg-white shadow-md rounded-md p-6 flex flex-col justify-between"
                >
                    {/* Star Rating */}
                    <div className="stars flex gap-1 mb-4">
                        {renderStars(review.rating)}
                    </div>

                    {/* Review Content */}
                    <p className="font-light text-gray-800 italic mb-4">
                        “{review.content}”
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3">
                        {/* <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                            <img
                                src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSSugC5bvVZjZwI4zQTUk9KRJF8Pfw4ePLXQ1uKhX0QaeptdJg5RwIct3JvOnOajfiH4nKGPZx5LzIyLUjzmmRZB4Nm2RHWE2o51VHLEg"
                                alt="avatar"
                                className="object-cover w-full h-full"
                            />
                        </div> */}
                        <div>
                            <h4 className="font-semibold text-gray-900 text-md">
                                {review.reviewer || "Anonymous"}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;