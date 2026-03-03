import API from "../config/api";

export const getProducts = (perPage = 10, page = 1) =>
    API.get("/products", {
        params: {
            per_page: perPage,
            page: page,
        },
    });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const updatedProductStatus = (id, status) => API.patch(`/product-status/${id}`, { status });