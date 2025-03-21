import { Link } from "react-router-dom";

const FragranceCard = ({ fragrance }) => {
    return (
        <div className="fragrance-card">
            <img src={fragrance.image} alt={fragrance.name} className="fragrance-image" />
            <h3>{fragrance.name}</h3>
            <p><strong>Brand:</strong> {fragrance.brand}</p>
            <p><strong>Launch Date:</strong> {fragrance.launch_date}</p>
            {(fragrance.perfumers || []).length > 0 && <p><strong>Perfumers:</strong> {fragrance.perfumers.join(", ")}</p>}
            {(fragrance.notes || []).length > 0 && <p><strong>Notes:</strong> {fragrance.notes.join(", ")}</p>}
            {(fragrance.top_notes || []).length > 0 && <p><strong>Top Notes:</strong> {fragrance.top_notes.join(", ")}</p>}
            {(fragrance.heart_notes || []).length > 0 && <p><strong>Heart Notes:</strong> {fragrance.heart_notes.join(", ")}</p>}
            {(fragrance.base_notes || []).length > 0 && <p><strong>Base Notes:</strong> {fragrance.base_notes.join(", ")}</p>}
            <p><strong>Description:</strong> {fragrance.description}</p>

            {/* Link to individual fragrance details page */}
            <Link to={`/fragrance/${fragrance.id}`} className="details-button">
                View Details
            </Link>
        </div>
    );
};

export default FragranceCard;