import  ImageUpload  from "../../components/ImageUpload";
function ProductFormFields({ form, setForm, handleChange, onSubmit, isEdit, categories, errors }) {
    return (
        <div className="bg-white shadow p-6 rounded-lg w-full">
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">

                <div className="w-[50%]">
                    <label>Name</label>
                    <input
                        name="name"
                        className="w-full border p-2 rounded"
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors?.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="w-full border p-2 rounded"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        className="w-full border p-2 rounded"
                        value={form.price}
                        onChange={handleChange}
                    />
                    {errors?.price && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.price[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        className="w-full border p-2 rounded"
                        value={form.quantity}
                        onChange={handleChange}
                    />
                    {errors?.quantity && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.quantity[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        className="w-full border p-2 rounded"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    {errors?.status && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.status[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label>Category</label>
                    <select
                        name="category_id"
                        className="w-full border p-2 rounded"
                        value={form.category_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <ImageUpload 
                    value={form.image_url}
                    onChange={({ files, existingIds }) =>
                        setForm(prev => ({
                            ...prev,
                            image: files,
                            existing_images: existingIds
                        }))
                    }
                />

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default ProductFormFields;