import { useEffect, useState,  } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getProducts, deleteProduct, updatedProductStatus, exportProducts } from "../../src/services/productServices";
import { getAllActiveCategories } from "../../src/services/categoryService";
import DataTable from "react-data-table-component";
import usePageTitle from "../../hooks/usePageTitle";
import { API_ROUTES } from "../../src/config/constants";


function ProductList() {
    const navigate = useNavigate();
    const location = useLocation();

    usePageTitle("Product List");
    const [products, setProducts] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("desc");

    const [message, setMessage] = useState("");


    useEffect(() => {
        fetchProducts(1, perPage, search);

        getAllActiveCategories().then(res => {
            setCategories(res.data.data);
        });

        if (location.state?.message) {
            setMessage(location.state.message);

            setTimeout(() => {
                setMessage("");
            }, 3000);

            navigate(location.pathname, { replace: true });
        }
    }, [search, categoryFilter, minPrice, maxPrice, sortBy, sortDir]);

    const fetchProducts = async (page = 1, perPageValue = perPage, searchValue = search) => {
        const res = await getProducts(perPageValue, page, searchValue, categoryFilter, minPrice, maxPrice, sortBy, sortDir);

        setProducts(res.data.data.data);
        setTotalRows(res.data.data.total);
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

    const handleExport = async () => {
        const res = await exportProducts({
            search,
            category: categoryFilter,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy,
            sort_dir: sortDir,
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "products.xlsx");
        document.body.appendChild(link);
        link.click();
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await importProducts(formData);

            alert("Products imported successfully");

            fetchProducts();
        } catch (error) {
            alert("Import failed");
        }
    };

    const handleReset = () => {
        setSearch("");
        setCategoryFilter("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("id");
        setSortDir("desc");

        fetchProducts(1, 10, "");
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

                <div className="flex gap-2">

                    <a
                        href={API_ROUTES.PRODUCT_DEMO_SHEET}
                        className="bg-orange-600 text-white px-4 py-2 rounded"
                    >
                        Download Demo Sheet
                    </a>

                    <label className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">
                        Import Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </label>

                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Export Excel
                    </button>

                    <Link
                        to="/products/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add Product
                    </Link>

                </div>
            </div>

            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 border border-green-400 text-green-700 flex justify-between items-center">
                    <span>{message}</span>
                    <button onClick={() => setMessage("")} className="font-bold">✕</button>
                </div>
            )}
            <div className="bg-white shadow rounded-lg">
                <div className="p-4 grid grid-cols-5 gap-4">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded"
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded"
                    />

                    <select
                        value={`${sortBy}-${sortDir}`}
                        onChange={(e) => {
                            const [column, direction] = e.target.value.split("-");
                            setSortBy(column);
                            setSortDir(direction);
                        }}
                        className="border border-gray-300 px-3 py-2 rounded"
                    >
                        <option value="id-desc">Newest</option>
                        <option value="price-asc">Price Low → High</option>
                        <option value="price-desc">Price High → Low</option>
                        <option value="name-asc">Name A → Z</option>
                        <option value="name-desc">Name Z → A</option>
                    </select>

                    <button
                        onClick={handleReset}
                        className="bg-blue-600 text-white px-3 py-2 rounded w-[50%]"
                    >
                        Reset
                    </button>

                </div>
                
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