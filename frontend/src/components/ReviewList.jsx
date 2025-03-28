import { useState, useContext } from "react";
import api from "../api/api";
import AuthContext from "../context/AuthContext";

const ReviewList = ({ reviews, setReviews }) => {
    const { user } = useContext(AuthContext); // get user from context
    const [error, setError] = useState("");

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            // Use setReviews from props to update the list
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        } catch (err) {
            console.error("Failed to delete review:", err);
            alert("Error deleting review.");
            setError(err);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i
                key={i}
                className={`bi ${i < rating ? "bi-star-fill text-yellow-500" : "bi-star text-gray-300"} text-xl`}
            ></i>
        ));
    };

    if (error) return <p className="text-red-500 mt-4">{error}</p>;
    if (reviews.length === 0) return <p className="text-gray-600 mt-4">No reviews yet. Be the first!</p>;

    return (
        <div className="flex flex-wrap gap-6 mt-8 justify-center">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="w-96 bg-white shadow-md rounded-md p-6 flex flex-col justify-between relative"
                >
                    {/* Delete Button for Owner */}
                    {user?.id === review.user_id && (
                        <button
                            onClick={() => handleDelete(review.id)}
                            className="absolute top-3 right-3 text-sm text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    )}

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