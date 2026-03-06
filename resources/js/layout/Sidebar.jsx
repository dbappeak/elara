import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();

    const linkClass = (path) => {
        const isActive =
            path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(path);

        return `block px-4 py-2 rounded ${
            isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
        }`;
    };

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

            <nav className="space-y-2">
                <Link to="/" className={linkClass("/dashboard")}>
                    Dashboard
                </Link>

                <Link to="/products" className={linkClass("/products")}>
                    Products
                </Link>

                <Link to="/categories" className={linkClass("/categories")}>
                    Categories
                </Link>
            </nav>
        </div>
    );
}

export default Sidebar;