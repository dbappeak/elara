import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createCategory,
    getCategory,
    updateCategory
} from "../../src/services/categoryService";

import usePageTitle from "../../hooks/usePageTitle";
import CategoryFormFields from "./CategoryFormFields";

function CategoryForm() {
    const { id } = useParams();
    usePageTitle(id ? "Edit Category" : "Add Category");

    const [form, setForm] = useState({
        name: "",
        status: "active",
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getCategory(id).then(res => {
                setForm({
                    name: res.data.data.name || "",
                    status: res.data.data.status || "active",
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("status", form.status);

        try{
            setErrors({});
            let res;

            if (id) {
                formData.append("_method", "PUT");

                res = await updateCategory(id, formData);
            } else {
                res = await createCategory(formData);
            }

            navigate("/categories", {
                state: { message: res.data.message }
            })
        } catch(error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }

        
    };


    return (
        <CategoryFormFields
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            isEdit={!!id}
            errors={errors}
        />
    );
}

export default CategoryForm;