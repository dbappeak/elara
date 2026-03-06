import API from "../config/api";

// const res = await getProducts(perPageValue, page, searchValue, categoryFilter, minPrice, maxPrice, sortBy, sortDir);
export const getProducts = (perPage = 10, page = 1, search = "", categoryFilter = "", minPrice = "", maxPrice = "", sortBy = "id", sortDir = "desc") =>
    API.get("/products", {
        params: {
            per_page: perPage,
            page: page,
            search: search,
            category: categoryFilter,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy,
            sort_dir: sortDir
        },
    });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => {
    data.append("_method", "PUT");
    return API.post(`/products/${id}`, data);
};
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const updatedProductStatus = (id, status) => API.patch(`/product-status/${id}`, { status });

export const exportProducts = (filters) => {
    return API.get("/product-export", {
        params: filters,
        responseType: "blob",
    });
};

export const importProducts = (formData) => {
    return API.post("/products/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};