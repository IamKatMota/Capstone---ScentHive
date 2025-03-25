import { useState } from "react";
import api from "../api/api"; 

const FragranceImportForm = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setStatus("Please select a file first.");

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);

            const res = await api.post("/admin/import-fragrances", jsonData);

            setStatus(res.data.message || "✅ Import successful!");
        } catch (err) {
            console.error(err);
            setStatus("❌ Error uploading or parsing JSON.");
        }
    };

    return (
        <div className="max-w-md p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-2">📤 Import Fragrances (JSON)</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="block w-full border p-2"
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Upload
                </button>
            </form>
            {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </div>
    );
};

export default FragranceImportForm;