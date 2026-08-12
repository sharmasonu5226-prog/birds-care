import { useContext, useState } from "react";

import { PetContext } from "../context/PetContext";
import { CategoryContext } from "../context/CategoryContext";

function BirdsPage() {
  const {
    pets,
    addPet,
    deletePet,
    updatePet,
  } = useContext(PetContext);

  const { categories } = useContext(CategoryContext);

  // =========================
  // ADD BIRD STATES
  // =========================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("In Stock");

  // =========================
  // EDIT BIRD
  // =========================

  const [editBird, setEditBird] = useState({});

  // =========================
  // READ IMAGE
  // =========================

  const readImage = (file, callback) => {
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // ADD BIRD IMAGE
  // =========================

  const handleBirdImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, (img) => {
      setImage(img);
    });
  };

  // =========================
  // EDIT BIRD IMAGE
  // =========================

  const handleEditBirdImage = (e, id) => {
    const file = e.target.files[0];

    if (!file) return;

    readImage(file, (img) => {
      setEditBird((prev) => ({
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          image: img,
        },
      }));
    });
  };

  // =========================
  // ADD BIRD
  // =========================

  const handleAddBird = (e) => {
    e.preventDefault();

    if (!name || !price || !type) {
      alert("Fill all bird details");
      return;
    }

    addPet({
      name,
      price,
      type,
      image: image || "",
      description,
      stock,
    });

    setName("");
    setPrice("");
    setType("");
    setImage("");
    setDescription("");
    setStock("In Stock");

    alert("Bird Added Successfully");
  };

  // =========================
  // CHANGE EDIT BIRD DATA
  // =========================

  const changeBird = (id, field, value) => {
    setEditBird((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value,
      },
    }));
  };

  // =========================
  // UPDATE BIRD
  // =========================

  const handleUpdateBird = (bird) => {
    const data = editBird[bird.id] || {};

    updatePet(bird.id, {
      name: data.name ?? bird.name,

      price:
        data.price !== undefined
          ? data.price
          : bird.price,

      type: data.type ?? bird.type,

      image:
        data.image !== undefined
          ? data.image
          : bird.image,

      description:
        data.description !== undefined
          ? data.description
          : bird.description,

      stock:
        data.stock !== undefined
          ? data.stock
          : bird.stock || "In Stock",
    });

    setEditBird((prev) => {
      const copy = { ...prev };

      delete copy[bird.id];

      return copy;
    });

    alert("Bird Updated Successfully");
  };

  // =========================
  // DELETE BIRD
  // =========================

  const handleDeleteBird = (id) => {
    if (window.confirm("Delete this bird?")) {
      deletePet(id);
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div className="admin-content">

      {/* =========================
          TITLE
      ========================= */}

      <h1>🐦 Manage Birds</h1>

      {/* =========================
          ADD BIRD
      ========================= */}

      <div className="add-box">

        <h2>Add New Bird</h2>

        <form onSubmit={handleAddBird}>

          {/* NAME */}

          <input
            type="text"
            placeholder="Bird Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* PRICE */}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* CATEGORY */}

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >

            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}

          </select>

          {/* STOCK */}

          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >

            <option value="In Stock">
              In Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

          </select>

          {/* IMAGE */}

          <input
            type="file"
            accept="image/*"
            onChange={handleBirdImage}
          />

          {/* DESCRIPTION */}

          <textarea
            placeholder="Bird Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          {/* ADD */}

          <button type="submit">
            ➕ Add Bird
          </button>

        </form>

      </div>

      {/* =========================
          BIRD LIST
      ========================= */}

      <div className="bird-list">

        {pets.length === 0 ? (

          <div className="empty-admin">

            <div>🐦</div>

            <h3>
              No Birds Added
            </h3>

            <p>
              Add your first bird above.
            </p>

          </div>

        ) : (

          pets.map((bird) => (

            <div
              key={bird.id}
              className="bird-admin-card"
            >

              {/* =========================
                  IMAGE
              ========================= */}

              {editBird[bird.id]?.image ||
              bird.image ? (

                <img
                  src={
                    editBird[bird.id]?.image ||
                    bird.image
                  }
                  alt={bird.name}
                />

              ) : (

                <div className="no-image">
                  {bird.emoji || "🐦"}
                </div>

              )}

              {/* =========================
                  INFORMATION
              ========================= */}

              <div className="admin-bird-info">

                {/* NAME */}

                <input
                  type="text"
                  value={
                    editBird[bird.id]?.name ??
                    bird.name
                  }
                  onChange={(e) =>
                    changeBird(
                      bird.id,
                      "name",
                      e.target.value
                    )
                  }
                />

                {/* PRICE */}

                <input
                  type="number"
                  value={
                    editBird[bird.id]?.price ??
                    bird.price
                  }
                  onChange={(e) =>
                    changeBird(
                      bird.id,
                      "price",
                      e.target.value
                    )
                  }
                />

                {/* CATEGORY */}

                <select
                  value={
                    editBird[bird.id]?.type ??
                    bird.type
                  }
                  onChange={(e) =>
                    changeBird(
                      bird.id,
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

                {/* =========================
                    STOCK
                ========================= */}

                <select
                  value={
                    editBird[bird.id]?.stock ??
                    bird.stock ??
                    "In Stock"
                  }
                  onChange={(e) =>
                    changeBird(
                      bird.id,
                      "stock",
                      e.target.value
                    )
                  }
                >

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>

                </select>

                {/* =========================
                    IMAGE UPDATE
                ========================= */}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleEditBirdImage(
                      e,
                      bird.id
                    )
                  }
                />

                {/* =========================
                    DESCRIPTION
                ========================= */}

                <textarea
                  value={
                    editBird[bird.id]
                      ?.description ??
                    bird.description ??
                    ""
                  }
                  onChange={(e) =>
                    changeBird(
                      bird.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                {/* =========================
                    CURRENT STOCK DISPLAY
                ========================= */}

                <div
                  style={{
                    marginTop: "5px",
                    marginBottom: "10px",
                    fontWeight: "700",
                    fontSize: "16px",
                    color:
                      (
                        editBird[bird.id]?.stock ??
                        bird.stock ??
                        "In Stock"
                      ) === "In Stock"
                        ? "green"
                        : "red",
                  }}
                >
                  Stock:{" "}
                  {
                    editBird[bird.id]?.stock ??
                    bird.stock ??
                    "In Stock"
                  }
                </div>

                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="admin-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBird(bird)
                    }
                  >
                    💾 Update
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteBird(bird.id)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default BirdsPage;