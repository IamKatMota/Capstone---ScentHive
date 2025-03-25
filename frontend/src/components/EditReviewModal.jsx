import React from "react";

const EditReviewModal = ({
    review,
    content,
    setContent,
    rating,
    setRating,
    onCancel,
    onSave
}) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Review</h3>
            <textarea
                className="w-full border p-2 rounded mb-3"
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <input
                type="number"
                min="1"
                max="5"
                className="w-full border p-2 rounded mb-4"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="text-gray-600 hover:underline"
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </div>
        </div>
    );
};

export default EditReviewModal;