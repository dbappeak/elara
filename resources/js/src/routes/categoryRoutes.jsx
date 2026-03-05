import CategoryList from "../../pages/categories/CategoryList";
import CategoryForm from "../../pages/categories/CategoryForm";
import CategoryDelete from "../../pages/categories/CategoryDelete";

const categoryRoutes = [
    { path: "categories", element: <CategoryList /> },
    { path: "categories/create", element: <CategoryForm /> },
    { path: "categories/edit/:id", element: <CategoryForm /> },
    { path: "categories/delete/:id", element: <CategoryDelete /> },
];

export default categoryRoutes;