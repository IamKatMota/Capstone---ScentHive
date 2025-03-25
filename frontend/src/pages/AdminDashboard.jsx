import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/api";
import EditReviewModal from "../components/EditReviewModal";
import EditFragranceModal from "../components/EditFragranceModal";
import AddFragranceModal from "../components/AddFragranceModal";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [fragrances, setFragrances] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [editingFragrance, setEditingFragrance] = useState(null);
    const [editFragranceData, setEditFragranceData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFragranceData, setNewFragranceData] = useState({});

    useEffect(() => {
        if (user?.isAdmin) {
            fetchUsers();
            fetchReviews();
            fetchFragrances();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users");
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get("/admin/reviews");
            setReviews(response.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    };

    const fetchFragrances = async () => {
        try {
            const response = await api.get("/admin/fragrances");
            setFragrances(response.data);
        } catch (err) {
            console.error("Failed to fetch fragrances", err);
        }
    };
    const handleEditFragrance = (fragrance) => {
        setEditingFragrance(fragrance);
        setEditFragranceData({
            name: fragrance.name || "",
            brand: fragrance.brand || "",
            launch_date: fragrance.launch_date || "",
            perfumers: fragrance.perfumers || "",
            notes: fragrance.notes || "",
            top_notes: fragrance.top_notes || "",
            heart_notes: fragrance.heart_notes || "",
            base_notes: fragrance.base_notes || "",
            description: fragrance.description || "",
            image: fragrance.image || ""
        });
    };
    // converts string to JS array before sending to backend 
    const parseArrayField = (input) => {
        if (!input) return [];
        return input
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    };

    const submitFragranceEdit = async () => {
        try {
            const payload = {
                ...editFragranceData,
                perfumers: parseArrayField(editFragranceData.perfumers),
                notes: parseArrayField(editFragranceData.notes),
                top_notes: parseArrayField(editFragranceData.top_notes),
                heart_notes: parseArrayField(editFragranceData.heart_notes),
                base_notes: parseArrayField(editFragranceData.base_notes),
            };
    
            await api.put(`/admin/fragrances/${editingFragrance.id}`, payload);
            setEditingFragrance(null);
            fetchFragrances();
        } catch (err) {
            console.error("Failed to update fragrance", err);
        }
    };
    const submitNewFragrance = async () => {
        try {
            const payload = {
                ...newFragranceData,
                perfumers: parseArrayField(newFragranceData.perfumers),
                notes: parseArrayField(newFragranceData.notes),
                top_notes: parseArrayField(newFragranceData.top_notes),
                heart_notes: parseArrayField(newFragranceData.heart_notes),
                base_notes: parseArrayField(newFragranceData.base_notes),
            };
    
            await api.post("/admin/fragrances", payload);
            fetchFragrances();
            setShowAddModal(false);
            setNewFragranceData({});
        } catch (err) {
            console.error("Failed to add fragrance", err);
        }
    };
    const handlePromoteUser = async (userId) => {
        try {
            await api.patch(`/admin/users/${userId}/promote`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to promote user", err);
        }
    };
    const handleDemoteUser = async (userId) => {
        try {
            await api.patch(`/admin/users/${userId}/demote`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to demote user", err);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/admin/reviews/${reviewId}`);
            fetchReviews();
        } catch (err) {
            console.error("Failed to delete review", err);
        }
    };

    const handleDeleteFragrance = async (fragranceId) => {
        try {
            await api.delete(`/admin/fragrances/${fragranceId}`);
            fetchFragrances();
        } catch (err) {
            console.error("Failed to delete fragrance", err);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const submitReviewEdit = async () => {
        try {
            await api.put(`/admin/reviews/${editingReview.id}`, {
                content: editContent,
                rating: editRating,
            });
            setEditingReview(null);
            fetchReviews();
        } catch (err) {
            console.error("Failed to edit review", err);
        }
    };

    if (!user?.isAdmin) {
        return <p className="text-center mt-10 text-red-600">Access denied.</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-6">
                {['users', 'reviews', 'fragrances'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Users</h2>
                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Review Count</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">{user.is_admin ? 'Admin' : 'User'}</td>
                                    <td className="p-2">{user.review_count}</td>
                                    <td className="p-2 space-x-2">

                                        <button
                                            className="text-red-500 text-xs hover:underline" onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                        {!user.is_admin &&
                                            <button
                                                className="text-green-500 text-xs hover:underline"
                                                onClick={() => handlePromoteUser(user.id)}
                                            >
                                                Make Admin
                                            </button>}
                                        {user.is_admin &&
                                            <button
                                                className="text-green-500 text-xs hover:underline"
                                                onClick={() => handleDemoteUser(user.id)}
                                            >
                                                Demote Admin
                                            </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li key={review.id} className="bg-white p-4 rounded shadow border">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{review.user_name} on {review.fragrance_name}</p>
                                        <p className="text-sm italic">{review.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">Rating: {review.rating} ★</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            className="text-blue-500 text-xs hover:underline"
                                            onClick={() => handleEditReview(review)}>
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 text-xs hover:underline"
                                            onClick={() => handleDeleteReview(review.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Fragrances Tab */}
            {activeTab === 'fragrances' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Fragrances</h2>
                    <button className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => setShowAddModal(true)}
                    >
                        + Add New Fragrance
                    </button>
                    <ul className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4">
                        {fragrances.map((f) => (
                            <li key={f.id} className="bg-white p-3 border rounded shadow text-center">
                                <img src={f.image || '/placeholder.jpg'} alt={f.name} className="h-32 w-full object-contain mb-2" />
                                <p className="font-medium text-gray-800 mb-2">{f.name}</p>
                                <div className="space-x-2">
                                    <button
                                        className="text-blue-500 text-xs hover:underline"
                                        onClick={() => handleEditFragrance(f)}>
                                        Edit
                                    </button>
                                    <button className="text-red-500 text-xs hover:underline" onClick={() => handleDeleteFragrance(f.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* review modal */}

            {editingReview && (
                <EditReviewModal
                    review={editingReview}
                    content={editContent}
                    setContent={setEditContent}
                    rating={editRating}
                    setRating={setEditRating}
                    onCancel={() => setEditingReview(null)}
                    onSave={submitReviewEdit}
                />
            )}
            {/* edit fragrance modal */}
            {editingFragrance && (
                <EditFragranceModal
                    fragrance={editingFragrance}
                    data={editFragranceData}
                    setData={setEditFragranceData}
                    onCancel={() => setEditingFragrance(null)}
                    onSave={submitFragranceEdit}
                />
            )}
            {/* add fragrance modal */}
            {showAddModal && (
                <AddFragranceModal
                    data={newFragranceData}
                    setData={setNewFragranceData}
                    onCancel={() => setShowAddModal(false)}
                    onSave={submitNewFragrance}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
