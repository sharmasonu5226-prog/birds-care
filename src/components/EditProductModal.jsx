import { useState, useEffect } from "react";

function EditProductModal({ product, onUpdate, onClose }) {
  const [form, setForm] = useState(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "500px",
          padding: "25px",
          borderRadius: "12px",
        }}
      >
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows="4"
            style={inputStyle}
          />

          <button
            type="submit"
            style={saveBtn}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={onClose}
            style={cancelBtn}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const saveBtn = {
  background: "#2e7d32",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px",
};

const cancelBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default EditProductModal;