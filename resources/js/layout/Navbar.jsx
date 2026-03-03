function Navbar() {
    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">
                Laravel 12 + React SPA
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">Welcome, Admin</span>

                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;