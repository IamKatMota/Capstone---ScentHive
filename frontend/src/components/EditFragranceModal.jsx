import React from "react";
import { useEffect } from "react";


const EditFragranceModal = ({ fragrance, data, setData, onCancel, onSave }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
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
                <div className="max-h-[80vh] overflow-y-auto p-4">

                    <h2 className="text-xl font-semibold mb-4">Edit Fragrance</h2>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={data.brand}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Launch Date</label>
                            <input
                                type="text"
                                name="launch_date"
                                value={data.launch_date}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="YYYY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Perfumers</label>
                            <input
                                type="text"
                                name="perfumers"
                                value={data.perfumers || ""}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                                name="notes"
                                value={data.notes}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Top Notes</label>
                            <input
                                type="text"
                                name="top_notes"
                                value={data.top_notes || ""}
                                onChange={handleChange}
                                placeholder="e.g., Bergamot, Lemon"
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Heart Notes</label>
                            <input
                                type="text"
                                name="heart_notes"
                                value={data.heart_notes || ""}
                                onChange={handleChange}
                                placeholder="e.g., Jasmine, Rose"
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Base Notes</label>
                            <input
                                type="text"
                                name="base_notes"
                                value={data.base_notes || ""}
                                onChange={handleChange}
                                placeholder="e.g., Amber, Musk"
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={data.description || ""}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <textarea
                                name="image"
                                value={data.image || ""}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded text-sm"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={onCancel}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditFragranceModal;
