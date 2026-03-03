import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createCategory,
    getCategory,
    updateCategory
} from "../../src/services/categoryService";

function CategoryForm() {
    return (
        <h1>Category Form</h1>
    );
}

export default CategoryForm;