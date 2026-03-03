import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, deleteProduct, updatedProductStatus } from "../../src/services/productServices";
import DataTable from "react-data-table-component";
import usePageTitle from "../../hooks/usePageTitle";


function ProductList() {
    usePageTitle("Product List");
    const [products, setProducts] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1, perPageValue = perPage) => {
        const res = await getProducts(perPageValue, page);

        setProducts(res.data.data);
        setTotalRows(res.data.total);
        setPage(page);
        setPerPage(perPageValue);
    };

    const handlePageChange = page => {
        fetchProducts(page, perPage);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        await deleteProduct(id);
        fetchProducts();
    };

    const handleStatusToggle = async (product) => {
        const newStatus = product.status === "active" ? "inactive" : "active";
        await updatedProductStatus(product.id, newStatus);
        fetchProducts(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        fetchProducts(page, newPerPage);
    };

    const columns = [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Price",
            selector: row => row.price,
            sortable: true,
        },
        {
            name: "Category",
            selector: row => row.category ? row.category.name : "Uncategorized",
            sortable: true,
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
            cell: row => (
                <div className="space-x-2">
                    <button
                        onClick={() => navigate(`/products/edit/${row.id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <Link
                    to="/products/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Product
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg">
                <DataTable
                    title="Product List"
                    columns={columns}
                    data={products}
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

export default ProductList;