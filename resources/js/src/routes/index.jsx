import { Routes, Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import AuthLayout from "../../layout/AuthLayout";
import Dashboard from "../../pages/Dashboard";
import RedirectPage from "../../pages/RedirectPage";

import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import authRoutes from "./authRoutes";

import ProtectedRoute from "../../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RedirectPage />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
                }>
                <Route index path={"/dashboard"} element={<Dashboard />} />

                {productRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {categoryRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>

            <Route path="/auth/*" element={<AuthLayout />}>
                {authRoutes.children.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>
        </Routes>
    );
}

export default AppRoutes;