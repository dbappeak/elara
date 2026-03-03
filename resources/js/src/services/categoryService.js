import API from "../config/api";

export const getCategories = () => API.get("/categories");
export const getCategory = (id) => API.get(`/categories/${id}`);
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const updatedCategoryStatus = (id, status) => API.patch(`/category-status/${id}`, { status });

export const getAllActiveCategories = () => API.get("/active-categories");