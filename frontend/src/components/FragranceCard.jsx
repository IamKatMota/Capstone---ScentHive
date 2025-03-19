import { Link } from "react-router-dom";

const FragranceCard = ({ fragrance }) => {
    return (
        <div className="fragrance-card">
            <img src={fragrance.image} alt={fragrance.name} className="fragrance-image" />
            <h3>{fragrance.name}</h3>
            <p><strong>Brand:</strong> {fragrance.brand}</p>
            <p><strong>Launch Date:</strong> {fragrance.launch_date}</p>
            <p><strong>Perfumer:</strong> {fragrance.perfumers}</p>
            <p><strong>Notes:</strong> {fragrance.notes}</p>
            <p><strong>Description:</strong> {fragrance.description}</p>

            {/* Link to individual fragrance details page */}
            <Link to={`/fragrance/${fragrance.id}`} className="details-button">
                View Details
            </Link>
        </div>
    );
};

export default FragranceCard;