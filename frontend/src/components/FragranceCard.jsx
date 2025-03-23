import { Link } from "react-router-dom";

const FragranceCard = ({ fragrance }) => {
    return (
        <div className="group relative bg-white shadow-md rounded-xl overflow-hidden w-full max-w-xs mx-auto">
            {/* Image Section */}
            <Link to={`/fragrance/${fragrance.id}`}>

            <div className="h-48 bg-white-100 flex items-center justify-center overflow-hidden">
                <img
                    src={fragrance.image || "/placeholder.jpg"}
                    alt={fragrance.name}
                    className="object-contain h-full w-full transform transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            </Link>

            {/* Name Overlay on Hover */}
            <div className="hidden sm:block absolute bottom-0 left-0 w-full bg-gray-200 bg-opacity-80 px-4 py-2 text-center transition-all group-hover:opacity-100 opacity-90">
                <Link to={`/fragrance/${fragrance.id}`}>
                <h3 className="hidden sm:block text-gray-800 text-xs font-semibold tracking-wide group-hover:text-rose-600 transition-colors duration-300">

                        {fragrance.name}
                    </h3>
                </Link>
            </div>
        </div>
    );
};

export default FragranceCard;