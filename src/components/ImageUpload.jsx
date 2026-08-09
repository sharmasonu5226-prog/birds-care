import { useState } from "react";

function ImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    onImageSelect(file);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontWeight: "bold",
          display: "block",
          marginBottom: "10px",
        }}
      >
        Bird Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{
            marginTop: "20px",
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "2px solid #ddd",
          }}
        />
      )}
    </div>
  );
}

export default ImageUpload;