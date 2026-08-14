import { useContext, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";

function CategoryPage() {
  const {
    categories,
    addCategory,
    removeCategory,
    updateCategory,
  } = useContext(CategoryContext);

  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [catImage, setCatImage] = useState(null);

  const [editCategory, setEditCategory] = useState({});

  // =========================
  // READ IMAGE
  // =========================

  const readImage = (file, callback) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please sirf image file select karo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.onerror = () => {
      alert("Image read nahi ho paayi.");
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // ADD CATEGORY IMAGE
  // =========================

  const handleCategoryImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    readImage(file, (image) => {
      setCatImage(image);
    });
  };

  // =========================
  // EDIT CATEGORY IMAGE
  // =========================

  const handleEditCategoryImage = (e, id) => {
    const file = e.target.files?.[0];

    if (!file) return;

    readImage(file, (image) => {
      setEditCategory((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          image: image,
        },
      }));
    });
  };

  // =========================
  // ADD CATEGORY
  // =========================

  const handleAddCategory = async () => {
    if (!catName.trim()) {
      alert("Enter category name");
      return;
    }

    try {
      await addCategory({
        name: catName.trim(),
        emoji: catEmoji.trim() || "🐦",
        image: catImage || null,
      });

      setCatName("");
      setCatEmoji("");
      setCatImage(null);

      alert("Category Added");
    } catch (error) {
      console.error("Add category error:", error);
      alert("Category add nahi hui.");
    }
  };

  // =========================
  // CHANGE CATEGORY
  // =========================

  const changeCategory = (id, field, value) => {
    setEditCategory((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }));
  };

  // =========================
  // UPDATE CATEGORY
  // =========================

  const handleUpdateCategory = async (category) => {
    try {
      const edited = editCategory[category.id] || {};

      const updateData = {
        name: edited.name ?? category.name,
        emoji: edited.emoji ?? category.emoji,
      };

      // Image tabhi bhejna jab nayi image select ki gayi ho
      if (edited.image !== undefined) {
        updateData.image = edited.image;
      }

      console.log("Category ID:", category.id);
      console.log("Category update data:", updateData);

      await updateCategory(category.id, updateData);

      setEditCategory((prev) => {
        const copy = { ...prev };
        delete copy[category.id];
        return copy;
      });

      alert("Category Updated");
    } catch (error) {
      console.error("Category update error:", error);
      alert("Category update nahi hui.");
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap ye category delete karna chahte ho?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await removeCategory(id);
    } catch (error) {
      console.error("Delete category error:", error);
      alert("Category delete nahi hui.");
    }
  };

  // =========================
  // GET CURRENT IMAGE
  // =========================

  const getCategoryImage = (category) => {
    const editedImage =
      editCategory[category.id]?.image;

    if (editedImage) {
      return editedImage;
    }

    if (category.image) {
      return category.image;
    }

    return null;
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-page">

      <h1>Manage Categories</h1>

      {/* =========================
          ADD CATEGORY
      ========================= */}

      <div className="category-add-section">

        <h2>Add Category</h2>

        <input
          type="text"
          placeholder="Category Name"
          value={catName}
          onChange={(e) =>
            setCatName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Emoji"
          value={catEmoji}
          onChange={(e) =>
            setCatEmoji(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleCategoryImage}
        />

        {/* ADD IMAGE PREVIEW */}

        {catImage && (
          <div style={{ marginTop: "10px" }}>

            <p>Image Preview:</p>

            <img
              src={catImage}
              alt="Category Preview"
              width="150"
              height="150"
              style={{
                objectFit: "cover",
                borderRadius: "10px",
                display: "block",
              }}
            />

          </div>
        )}

        <br />

        <button onClick={handleAddCategory}>
          Add Category
        </button>

      </div>

      <hr />

      {/* =========================
          CATEGORY LIST
      ========================= */}

      <div className="category-list">

        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => {

            const image =
              getCategoryImage(category);

            return (
              <div
                key={category.id}
                className="category-admin-card"
              >

                {/* =========================
                    CATEGORY IMAGE
                ========================= */}

                {image ? (
                  <img
                    src={image}
                    alt={category.name}
                    width="150"
                    height="150"
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      fontSize: "50px",
                    }}
                  >
                    {category.emoji || "🐦"}
                  </div>
                )}

                <br />

                {/* =========================
                    CATEGORY NAME
                ========================= */}

                <input
                  type="text"
                  value={
                    editCategory[category.id]?.name ??
                    category.name ??
                    ""
                  }
                  onChange={(e) =>
                    changeCategory(
                      category.id,
                      "name",
                      e.target.value
                    )
                  }
                />

                <br />

                {/* =========================
                    CATEGORY EMOJI
                ========================= */}

                <input
                  type="text"
                  value={
                    editCategory[category.id]?.emoji ??
                    category.emoji ??
                    ""
                  }
                  onChange={(e) =>
                    changeCategory(
                      category.id,
                      "emoji",
                      e.target.value
                    )
                  }
                />

                <br />

                {/* =========================
                    CHANGE IMAGE
                ========================= */}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleEditCategoryImage(
                      e,
                      category.id
                    )
                  }
                />

                <br />

                {/* =========================
                    UPDATE BUTTON
                ========================= */}

                <button
                  onClick={() =>
                    handleUpdateCategory(category)
                  }
                >
                  Update
                </button>

                {/* =========================
                    DELETE BUTTON
                ========================= */}

                <button
                  onClick={() =>
                    handleDeleteCategory(category.id)
                  }
                >
                  Delete
                </button>

                <hr />

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default CategoryPage;