function CategoryFormFields({ form, setForm, handleChange, onSubmit, isEdit, errors }) {
    return (
        <div className="bg-white shadow p-6 rounded-lg w-full">
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
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
                    <label>Status</label>
                    <select
                        name="status"
                        className="w-full border p-2 rounded"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors?.status && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.status[0]}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default CategoryFormFields;