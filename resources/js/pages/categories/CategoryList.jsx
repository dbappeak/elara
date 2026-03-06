import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCategories, deleteCategory, updatedCategoryStatus } from "../../src/services/categoryService";
import DataTable from "react-data-table-component";
import usePageTitle from "../../hooks/usePageTitle";

function CategoryList() {
    usePageTitle("Category List");
    const [categories, setCategories] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();

    const location = useLocation();
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCategories();
        if (location.state?.message) {
            setMessage(location.state.message);

            setTimeout(() => {
                setMessage("");
            }, 3000);

            navigate(location.pathname, { replace: true });
        }
    }, []);

    const fetchCategories = async (page = 1, perPageValue = perPage) => {
        const res = await getCategories(perPageValue, page);
        setCategories(res.data.data.data);
        setTotalRows(res.data.data.total);
        setPage(page);
        setPerPage(perPageValue);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        await deleteCategory(id);
        fetchCategories();
    }

    const handleStatusToggle = async (category) => {
            const newStatus = category.status === "active" ? "inactive" : "active";
            await updatedCategoryStatus(category.id, newStatus);
            fetchCategories(page);
        }

    const handlePageChange = page => {
        fetchCategories(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        fetchCategories(page, newPerPage);
    }

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Status",
            cell: row => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.status === "active"}
                        onChange={() => handleStatusToggle(row)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                                    peer-checked:bg-green-500 
                                    relative transition-all
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                    after:bg-white after:rounded-full 
                                    after:h-5 after:w-5 after:transition-all
                                    peer-checked:after:translate-x-full">
                    </div>
                </label>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex space-x-2">
                    <Link
                        to={`/categories/edit/${row.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            ),
        }
    ];

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
            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 border border-green-400 text-green-700 flex justify-between items-center">
                    <span>{message}</span>
                    <button onClick={() => setMessage("")} className="font-bold">✕</button>
                </div>
            )}
            
            <div className="bg-white shadow rounded-lg">    
                <DataTable
                    title="Category List"
                    columns={columns}
                    data={categories}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationPerPage={perPage}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    highlightOnHover
                    striped
                    responsive
                />
            </div>
        </div>
    );
}

export default CategoryList;