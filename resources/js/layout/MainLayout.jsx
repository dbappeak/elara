import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                 <Navbar />
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;