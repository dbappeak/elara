import { useParams, useNavigate } from "react-router-dom";
import { deleteCategory } from "../../src/services/categoryService";

function CategoryDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleDelete = async () => {
        await deleteCategory(id);
        navigate("/categories");
    };

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Are you sure?</h2>
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                Yes, Delete
            </button>
        </div>
    );
}

export default CategoryDelete;