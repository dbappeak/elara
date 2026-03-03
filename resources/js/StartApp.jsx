import { Routes, Route, Link } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";
import ProductDelete from "./pages/products/ProductDelete";
import CategoryDelete from "./pages/categories/CategoryDelete";


function StartApp(){
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="/products/*" element={<ProductList />} />
                <Route path="/products/create" element={<ProductForm />} />
                <Route path="/products/edit/:id" element={<ProductForm />} />
                <Route path="/products/delete/:id" element={<ProductDelete />} />
                
                <Route path="/categories/*" element={<CategoryList />} />
                <Route path="/categories/create" element={<CategoryForm />} />
                <Route path="/categories/edit/:id" element={<CategoryForm />} />
                <Route path="/categories/delete/:id" element={<CategoryDelete />} />
            </Route>
        </Routes>
    );
}

export default StartApp;