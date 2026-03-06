import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../src/services/authServices";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await getUser();
            setUser(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }

        localStorage.removeItem("token");
        navigate("/auth/login");
    };

    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">
                Laravel 12 + React SPA
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-600">Welcome, {user ? user.name : "Loading..."}</span>

                <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;