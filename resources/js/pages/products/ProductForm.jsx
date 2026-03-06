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
        status: "active",
        category_id: "",
        image: [],
        existing_images: [],
        image_url: null,
    });
    const [errors, setErrors] = useState({});
    
    const navigate = useNavigate();

    useEffect(() => {
        getAllActiveCategories().then(res => {
            setCategories(res.data.data);
        });
        if (id) {
            getProduct(id).then(res => {
                setForm({
                    name: res.data.data.name || "",
                    description: res.data.data.description || "",
                    price: res.data.data.price || "",
                    quantity: res.data.data.quantity || "",
                    status: res.data.data.status || null,
                    category_id: res.data.data.category_id || "",
                    image: [],
                    existing_images: res.data.data.product_images.map(img => img.id),
                    image_url: res.data.data.product_images || []
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];

            setForm(prev => ({
                ...prev,
                image: file,
                image_preview: URL.createObjectURL(file)
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("quantity", form.quantity);
        formData.append("status", form.status);
        formData.append("category_id", form.category_id);

        if (form.image && form.image.length > 0) {
            form.image.forEach((file) => {
                formData.append("images[]", file);
            });
        }

        if (form.existing_images && form.existing_images.length > 0) {
            form.existing_images.forEach((id) => {
                formData.append("existing_images[]", id);
            });
        }

        try {

            setErrors({});
            let res;

            if (id) {
                formData.append("_method", "PUT");
                res = await updateProduct(id, formData);
            } else {
                res = await createProduct(formData);
            }

            navigate("/products", {
                state: { message: res.data.message }
            });

        } catch (error) {

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <ProductFormFields
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={!!id}
            categories={categories}
            errors={errors}
        />
    );
}

export default ProductForm;