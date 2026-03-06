import { Navigate } from "react-router-dom";

function RedirectPage() {
    const token = localStorage.getItem("token");

    return token ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <Navigate to="/auth/login" replace />
    );
}

export default RedirectPage;