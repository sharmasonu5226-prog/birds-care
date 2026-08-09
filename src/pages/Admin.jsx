import { useContext, useState } from "react";

import { PetContext } from "../context/PetContext";
import { CategoryContext } from "../context/CategoryContext";

function Admin() {
  const {
    pets,
    addPet,
    deletePet,
    updatePet,
  } = useContext(PetContext);

  const {
    categories,
    addCategory,
    removeCategory,
    updateCategory,
  } = useContext(CategoryContext);

  const [activeSection, setActiveSection] = useState("home");

  // ADD PET
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // ADD CATEGORY
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [catImage, setCatImage] = useState("");

  // EDIT PET
  const [editPetData, setEditPetData] = useState({});

  // EDIT CATEGORY
  const [editCategoryData, setEditCategoryData] = useState({});

  // IMAGE READER
  const readImage = (file, callback) => {
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // PET IMAGE
  const handlePetImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, setImage);
  };

  // CATEGORY IMAGE
  const handleCategoryImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, setCatImage);
  };

  // EDIT PET IMAGE
  const handleEditPetImage = (e, id) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, (img) => {
      setEditPetData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          image: img,
        },
      }));
    });
  };

  // EDIT CATEGORY IMAGE
  const handleEditCategoryImage = (e, id) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, (img) => {
      setEditCategoryData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          image: img,
        },
      }));
    });
  };

  // ADD PET
  const handleAddPet = (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("Please fill all required fields.");
      return;
    }

    addPet({
      name,
      price,
      type: category,
      image: image || "🐦",
      description,
    });

    setName("");
    setPrice("");
    setCategory("");
    setImage("");
    setDescription("");

    alert("Bird added successfully!");
  };

  // ADD CATEGORY
  const handleAddCategory = (e) => {
    e.preventDefault();

    if (!catName) {
      alert("Please enter category name.");
      return;
    }

    addCategory({
      name: catName,
      emoji: catEmoji || "🐦",
      image: catImage,
    });

    setCatName("");
    setCatEmoji("");
    setCatImage("");

    alert("Category added successfully!");
  };

  // CHANGE PET
  const changePet = (id, field, value) => {
    setEditPetData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // UPDATE PET
  const handleUpdatePet = (pet) => {
    const data = editPetData[pet.id] || {};

    updatePet(pet.id, {
      name: data.name ?? pet.name,
      price: data.price ?? pet.price,
      type: data.type ?? pet.type,
      image: data.image ?? pet.image,
      description: data.description ?? pet.description,
    });

    setEditPetData((prev) => {
      const copy = { ...prev };
      delete copy[pet.id];
      return copy;
    });

    alert("Bird updated successfully!");
  };

  // CHANGE CATEGORY
  const changeCategory = (id, field, value) => {
    setEditCategoryData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // UPDATE CATEGORY
  const handleUpdateCategory = (cat) => {
    const data = editCategoryData[cat.id] || {};

    updateCategory(cat.id, {
      name: data.name ?? cat.name,
      emoji: data.emoji ?? cat.emoji,
      image: data.image ?? cat.image,
    });

    setEditCategoryData((prev) => {
      const copy = { ...prev };
      delete copy[cat.id];
      return copy;
    });

    alert("Category updated successfully!");
  };

  const selectedCategory =
    activeSection !== "home" &&
    activeSection !== "categories" &&
    categories.find((cat) => cat.name === activeSection);

  const categoryPets = selectedCategory
    ? pets.filter((pet) => pet.type === selectedCategory.name)
    : [];

  return (
    <section className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Panel 🛠️</h1>
          <p>
            Manage your bird categories and birds from here.
          </p>
        </div>
      </div>

      {/* HOME */}
      {activeSection === "home" && (
        <>
          <div className="admin-welcome">
            <h2>Welcome to Admin Panel 👋</h2>

            <p>
              First select what you want to manage.
            </p>

            <p>
              Select a category below to add or manage birds.
            </p>
          </div>

          <div className="admin-main-grid">

            {/* CATEGORIES */}
            <div
              className="admin-main-card"
              onClick={() => setActiveSection("categories")}
            >
              <div className="admin-main-icon">
                📂
              </div>

              <h2>
                Manage Categories
              </h2>

              <p>
                Add, edit or delete bird categories.
              </p>

              <strong>
                {categories.length} Categories
              </strong>

              <button>
                Open Categories →
              </button>
            </div>

            {/* BIRDS */}
            <div
              className="admin-main-card"
              onClick={() => {
                if (categories.length > 0) {
                  setActiveSection(categories[0].name);
                }
              }}
            >
              <div className="admin-main-icon">
                🐦
              </div>

              <h2>
                Manage Birds
              </h2>

              <p>
                Select a bird category and manage its birds.
              </p>

              <strong>
                {pets.length} Birds
              </strong>

              <button>
                Open Birds →
              </button>
            </div>

          </div>

          {/* CATEGORY SHORTCUTS */}
          <div className="admin-shortcuts">
            <h2>
              Bird Categories
            </h2>

            <div className="admin-category-buttons">

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveSection(cat.name)
                  }
                >
                  {cat.emoji || "🐦"} {cat.name}
                </button>
              ))}

            </div>
          </div>
        </>
      )}

      {/* CATEGORY LIST */}
      {activeSection === "categories" && (
        <div className="admin-content">

          <div className="admin-topbar">
            <button
              onClick={() => setActiveSection("home")}
            >
              ← Back
            </button>

            <h2>
              📂 Add / Manage Categories
            </h2>
          </div>

          {/* ADD CATEGORY */}
          <div className="admin-form-card">

            <h3>
              ➕ Add New Category
            </h3>

            <form onSubmit={handleAddCategory}>

              <input
                type="text"
                placeholder="Category Name"
                value={catName}
                onChange={(e) =>
                  setCatName(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Emoji e.g. 🦜"
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

              <button type="submit">
                ➕ Add Category
              </button>

            </form>
          </div>

          {/* CATEGORY CARDS */}
          <div className="admin-list-grid">

            {categories.map((cat) => {

              const data =
                editCategoryData[cat.id] || {};

              const categoryImage =
                data.image || cat.image;

              return (
                <div
                  className="admin-manage-card"
                  key={cat.id}
                >

                  <div className="admin-manage-image">

                    {categoryImage ? (
                      <img
                        src={categoryImage}
                        alt={cat.name}
                      />
                    ) : (
                      <span>
                        {data.emoji || cat.emoji || "🐦"}
                      </span>
                    )}

                  </div>

                  <input
                    type="text"
                    value={
                      data.name ?? cat.name
                    }
                    onChange={(e) =>
                      changeCategory(
                        cat.id,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    value={
                      data.emoji ?? cat.emoji ?? ""
                    }
                    onChange={(e) =>
                      changeCategory(
                        cat.id,
                        "emoji",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleEditCategoryImage(
                        e,
                        cat.id
                      )
                    }
                  />

                  <div className="admin-buttons">

                    <button
                      onClick={() =>
                        handleUpdateCategory(cat)
                      }
                    >
                      💾 Update
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${cat.name}?`
                          )
                        ) {
                          removeCategory(cat.id);
                        }
                      }}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                  <button
                    className="open-category-btn"
                    onClick={() =>
                      setActiveSection(cat.name)
                    }
                  >
                    Open {cat.name} Birds →
                  </button>

                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* SELECTED CATEGORY */}
      {selectedCategory && (
        <div className="admin-content">

          <div className="admin-topbar">

            <button
              onClick={() => setActiveSection("home")}
            >
              ← Back
            </button>

            <div>
              <h2>
                {selectedCategory.emoji || "🐦"}{" "}
                {selectedCategory.name}
              </h2>

              <p>
                Manage all {selectedCategory.name} birds here.
              </p>
            </div>

          </div>

          {/* ADD BIRD */}
          <div className="admin-form-card">

            <h3>
              ➕ Add New {selectedCategory.name}
            </h3>

            <form onSubmit={handleAddPet}>

              <input
                type="text"
                placeholder="Bird Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.name}
                  >
                    {cat.emoji || "🐦"} {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={handlePetImage}
              />

              <textarea
                placeholder="Bird Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <button type="submit">
                ➕ Add Bird
              </button>

            </form>
          </div>

          {/* BIRDS */}
          <div className="admin-birds-header">
            <h2>
              {selectedCategory.emoji || "🐦"}{" "}
              {selectedCategory.name} Birds
            </h2>

            <span>
              {categoryPets.length} Birds
            </span>
          </div>

          {categoryPets.length === 0 ? (
            <div className="empty-admin">
              <div>🐦</div>

              <h3>
                No {selectedCategory.name} Birds Yet
              </h3>

              <p>
                Add your first bird using the form above.
              </p>
            </div>
          ) : (
            <div className="admin-list-grid">

              {categoryPets.map((pet) => {

                const data =
                  editPetData[pet.id] || {};

                const petImage =
                  data.image || pet.image;

                return (
                  <div
                    className="admin-manage-card"
                    key={pet.id}
                  >

                    <div className="admin-manage-image">

                      {petImage &&
                      (
                        petImage.startsWith("http") ||
                        petImage.startsWith("data:image")
                      ) ? (
                        <img
                          src={petImage}
                          alt={data.name || pet.name}
                        />
                      ) : (
                        <span>
                          {petImage || "🐦"}
                        </span>
                      )}

                    </div>

                    <input
                      type="text"
                      placeholder="Bird Name"
                      value={
                        data.name ?? pet.name
                      }
                      onChange={(e) =>
                        changePet(
                          pet.id,
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      value={
                        data.price ?? pet.price
                      }
                      onChange={(e) =>
                        changePet(
                          pet.id,
                          "price",
                          e.target.value
                        )
                      }
                    />

                    <select
                      value={
                        data.type ?? pet.type
                      }
                      onChange={(e) =>
                        changePet(
                          pet.id,
                          "type",
                          e.target.value
                        )
                      }
                    >
                      {categories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.name}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Bird Description"
                      value={
                        data.description ??
                        pet.description ??
                        ""
                      }
                      onChange={(e) =>
                        changePet(
                          pet.id,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditPetImage(
                          e,
                          pet.id
                        )
                      }
                    />

                    <div className="admin-buttons">

                      <button
                        onClick={() =>
                          handleUpdatePet(pet)
                        }
                      >
                        💾 Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${pet.name}?`
                            )
                          ) {
                            deletePet(pet.id);
                          }
                        }}
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

    </section>
  );
}

export default Admin;