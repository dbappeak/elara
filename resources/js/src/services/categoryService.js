import API from "../config/api";

export const getCategories = (perPage = 10, page = 1) => 
    API.get("/categories", {
        params: {
            per_page: perPage,
            page: page,
        },
    });
export const getCategory = (id) => API.get(`/categories/${id}`);
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => {
    data.append("_method", "PUT");
    return API.post(`/categories/${id}`, data);
}
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const updatedCategoryStatus = (id, status) => API.patch(`/category-status/${id}`, { status });

export const getAllActiveCategories = () => API.get("/active-categories");