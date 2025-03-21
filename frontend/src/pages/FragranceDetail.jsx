import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const FragranceDetail = () => {
    const { id } = useParams();
    const [fragrance, setFragrance] = useState(null);
    const [error, setError] = useState(null);

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