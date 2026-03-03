import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createProduct,
    getProduct,
    updateProduct
} from "../../src/services/productServices";

import { getAllActiveCategories } from "../../src/services/categoryService";

import ProductFormFields from "./ProductFormFields";
import usePageTitle from "../../hooks/usePageTitle";

function ProductForm() {
    const { id } = useParams();
    usePageTitle(id ? "Edit Product" : "Add Product");

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        status: 1,
        category_id: "",
        image: null,
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        getAllActiveCategories().then(res => {
            setCategories(res.data);
        });
        if (id) {
            getProduct(id).then(res => {
                setForm({
                    name: res.data.name || "",
                    description: res.data.description || "",
                    price: res.data.price || "",
                    quantity: res.data.quantity || "",
                    status: res.data.status || 1,
                    category_id: res.data.category_id || "",
                    image: null,
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null) {
                formData.append(key, form[key]);
            }
        });

        if (id) {
            await updateProduct(id, formData);
        } else {
            await createProduct(formData);
        }

        navigate("/products");
    };

    return (
        <ProductFormFields
            form={form}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={!!id}
            categories={categories}
        />
    );
}

export default ProductForm;