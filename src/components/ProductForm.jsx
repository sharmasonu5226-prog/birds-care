import { useState } from "react";
import ImageUpload from "./ImageUpload";

function ProductForm({ onAddProduct }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    featured: false,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageSelect = (file) => {
    setProduct({
      ...product,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddProduct({
      id: Date.now(),
      ...product,
    });

    setProduct({
      name: "",
      price: "",
      category: "",
      description: "",
      stock: "",
      featured: false,
      image: null,
    });

    alert("Product Added Successfully");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "30px",
      }}
    >
      <h2>Add New Bird</h2>

      <ImageUpload onImageSelect={handleImageSelect} />

      <input
        name="name"
        placeholder="Bird Name"
        value={product.name}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <input
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={product.category}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        rows="4"
        style={inputStyle}
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock Quantity"
        value={product.stock}
        onChange={handleChange}
        style={inputStyle}
      />

      <label
        style={{
          display: "block",
          marginBottom: "20px",
        }}
      >
        <input
          type="checkbox"
          name="featured"
          checked={product.featured}
          onChange={handleChange}
        />

        {" "}Featured Product
      </label>

      <button
        type="submit"
        style={{
          background: "#2e7d32",
          color: "white",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Add Product
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default ProductForm;