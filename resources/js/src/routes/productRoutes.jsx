import ProductList from "../../pages/products/ProductList";
import ProductForm from "../../pages/products/ProductForm";
import ProductDelete from "../../pages/products/ProductDelete";

const productRoutes = [
    { path: "products", element: <ProductList /> },
    { path: "products/create", element: <ProductForm /> },
    { path: "products/edit/:id", element: <ProductForm /> },
    { path: "products/delete/:id", element: <ProductDelete /> },
];

export default productRoutes;