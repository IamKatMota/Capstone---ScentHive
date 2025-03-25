import React from "react";
import { useEffect } from "react";


const AddFragranceModal = ({ data, setData, onCancel, onSave }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };
     //prevents scrolling when modal open 
        useEffect(() => {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "auto";
            };
        }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Fragrance</h2>
                <div className="space-y-3">
                    {[
                        "name", "brand", "launch_date", "perfumers",
                        "notes", "top_notes", "heart_notes",
                        "base_notes", "description", "image"
                    ].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium capitalize">
                                {field.replace("_", " ")}
                            </label>
                            <input
                                type="text"
                                name={field}
                                value={data[field] || ""}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded text-sm"
                                placeholder={field === "launch_date" ? "YYYY" : ""}
                            />
                        </div>
                    ))}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            onClick={onCancel}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                        >
                            Add Fragrance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFragranceModal;