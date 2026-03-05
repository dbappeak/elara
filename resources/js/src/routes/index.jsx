import { Routes, Route } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Dashboard from "../../pages/Dashboard";

import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />

                {productRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {categoryRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Route>
        </Routes>
    );
}

export default AppRoutes;