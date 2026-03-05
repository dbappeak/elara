import { useState, useEffect, useRef } from "react";

function ImageUpload({ value = [], onChange }) {

    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {

        if (!value || value.length === 0) {
            setPreviews([]);
            return;
        }

        const formatted = value.map((img) => {

            // API response object
            if (img?.image_url) {
                return {
                    id: img.id,
                    url: img.image_url,
                    existing: true
                };
            }

            // Already formatted
            if (img?.url) return img;

            // string URL
            if (typeof img === "string") {
                return {
                    url: img,
                    existing: true
                };
            }

            return img;
        });

        setPreviews(formatted);

    }, [value]);


    const updateParent = (updated) => {

        const files = updated
            .filter(img => img.file)
            .map(img => img.file);

        const existingIds = updated
            .filter(img => img.existing)
            .map(img => img.id);

        onChange({
            files,
            existingIds
        });
    };


    const handleChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        if (!selectedFiles.length) return;

        const newImages = selectedFiles.map(file => ({
            file,
            url: URL.createObjectURL(file),
            existing: false
        }));

        const updated = [...previews, ...newImages];

        setPreviews(updated);

        updateParent(updated);

        // reset input so same file can be reselected
        e.target.value = "";
    };


    const removeImage = (index) => {

        const updated = previews.filter((_, i) => i !== index);

        setPreviews(updated);

        updateParent(updated);
    };


    const openFileDialog = () => {
        fileInputRef.current.click();
    };


    return (
        <div className="space-y-4">

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">

                    {previews.map((img, index) => (
                        <div
                            key={index}
                            className="relative group h-40 w-40"
                        >
                            <img
                                src={img.url}
                                alt="preview"
                                className="h-40 w-40 object-cover rounded-lg border shadow"
                            />

                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                </div>
            )}


            {/* Upload Area */}
            <div
                onClick={openFileDialog}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
                <p className="text-sm text-gray-600 font-medium">
                    Click to upload images
                </p>

                <p className="text-xs text-gray-400">
                    PNG, JPG, WEBP (Multiple allowed)
                </p>
            </div>


            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

        </div>
    );
}

export default ImageUpload;