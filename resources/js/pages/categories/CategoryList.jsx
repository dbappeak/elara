import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../../src/services/categoryService";

function CategoryList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await getCategories();
        setCategories(res.data.data);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        await deleteCategory(id);
        fetchCategories();
    }



    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Link
                    to="/categories/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Category
                </Link>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Link
                                    to={`/categories/edit/${category.id}`}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoryList;