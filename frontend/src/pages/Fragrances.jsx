import { useEffect, useState } from "react";
import api from "../api/api"; 
import FragranceCard from "../components/FragranceCard"; 


const Fragrances = () => {
    const [fragrances, setFragrances] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchFragrances = async () => {
            try {
                const response = await api.get("/fragrances"); 
                console.log("API Response:", response.data);
                setFragrances(response.data);
            } catch (error) {
                console.error("Error fetching fragrances:", error);
                setError("Failed to load fragrances.");

            }
        };
        fetchFragrances();
    }, []);

    return (
        <div className="fragrance-list">
            <h2>Explore Fragrances</h2>
            <div className="fragrance-grid">
                {fragrances.length > 0 ? (
                    fragrances.map((fragrance) => (
                        <FragranceCard key={fragrance.id} fragrance={fragrance} />
                    ))
                ) : (
                    <p>No fragrances found.</p>
                )}
            </div>
        </div>
    );
};

export default Fragrances;