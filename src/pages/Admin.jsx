import {
  useContext,
  useState
} from "react";

import {
  PetContext
} from "../context/PetContext";

import {
  CategoryContext
} from "../context/CategoryContext";

import OrdersPage from "./OrdersPage";


function Admin() {

  const {
    pets,
    addPet,
    deletePet,
    updatePet
  } = useContext(PetContext);


  const {
    categories,
    addCategory,
    removeCategory
  } = useContext(CategoryContext);


  // =====================================================
  // ACTIVE MENU
  // =====================================================

  const [
    activeSection,
    setActiveSection
  ] = useState("home");


  // =====================================================
  // ADD PRODUCT FORM
  // =====================================================

  const [
    name,
    setName
  ] = useState("");

  const [
    singleMRP,
    setSingleMRP
  ] = useState("");

  const [
    singlePrice,
    setSinglePrice
  ] = useState("");

  const [
    pairMRP,
    setPairMRP
  ] = useState("");

  const [
    pairPrice,
    setPairPrice
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("");

  const [
    stock,
    setStock
  ] = useState("In Stock");

  const [
    image,
    setImage
  ] = useState("");

  const [
    description,
    setDescription
  ] = useState("");


  // =====================================================
  // EDIT PRODUCT DATA
  // =====================================================

  const [
    editPetData,
    setEditPetData
  ] = useState({});


  // =====================================================
  // CATEGORY
  // =====================================================

  const [
    catName,
    setCatName
  ] = useState("");

  const [
    catEmoji,
    setCatEmoji
  ] = useState("");

  const [
    catImage,
    setCatImage
  ] = useState("");


  // =====================================================
  // SHIPPING
  // =====================================================

  const [
    shippingCharge,
    setShippingCharge
  ] = useState(
    localStorage.getItem("shippingCharge") || "0"
  );


  // =====================================================
  // NUMBER CLEAN
  // =====================================================

  const number = (value) => {

    const n = Number(
      String(value ?? 0)
        .replace(/,/g, "")
        .trim()
    );

    return Number.isFinite(n)
      ? n
      : 0;

  };


  // =====================================================
  // IMAGE READER
  // =====================================================

  const readImage = (
    file,
    callback
  ) => {

    if (!file) return;

    if (!file.type?.startsWith("image/")) {

      alert(
        "Please sirf image file select karo."
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {

      callback(
        reader.result
      );

    };


    reader.onerror = () => {

      alert(
        "Image read nahi ho paayi ❌"
      );

    };


    reader.readAsDataURL(file);

  };


  // =====================================================
  // ADD PRODUCT IMAGE
  // =====================================================

  const handleBirdImage = (e) => {

    const file =
      e.target.files?.[0];

    readImage(
      file,
      (img) =>
        setImage(img)
    );

  };


  // =====================================================
  // EXISTING PRODUCT IMAGE
  // =====================================================

  const handleExistingBirdImage = (
    id,
    e
  ) => {

    const file =
      e.target.files?.[0];

    readImage(
      file,
      (img) => {

        changePet(
          id,
          "image",
          img
        );

      }
    );

  };


  // =====================================================
  // CATEGORY IMAGE
  // =====================================================

  const handleCategoryImage = (e) => {

    const file =
      e.target.files?.[0];

    readImage(
      file,
      (img) =>
        setCatImage(img)
    );

  };


  // =====================================================
  // EDIT PRODUCT CHANGE
  // =====================================================

  const changePet = (
    id,
    field,
    value
  ) => {

    setEditPetData(
      prev => ({

        ...prev,

        [id]: {

          ...(prev[id] || {}),

          [field]: value

        }

      })
    );

  };


  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddPet = async (e) => {

    e.preventDefault();


    if (!name.trim()) {

      alert(
        "Product name enter karo"
      );

      return;

    }


    if (!category) {

      alert(
        "Category select karo"
      );

      return;

    }


    const product = {

      name:
        name.trim(),

      price:
        number(singlePrice),

      singleOldPrice:
        number(singleMRP),

      singlePrice:
        number(singlePrice),

      pairOldPrice:
        number(pairMRP),

      pairPrice:
        number(pairPrice),

      type:
        category,

      stock:
        stock,

      image:
        image || null,

      description:
        description.trim()

    };


    const result =
      await addPet(product);


    if (result?.error) {

      alert(
        "Product add nahi hua ❌"
      );

      return;

    }


    setName("");

    setSingleMRP("");

    setSinglePrice("");

    setPairMRP("");

    setPairPrice("");

    setCategory("");

    setStock("In Stock");

    setImage("");

    setDescription("");


    alert(
      "Product Added Successfully ✅"
    );

  };


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdatePet =
    async (pet) => {

      const data =
        editPetData[pet.id] || {};


      const result =
        await updatePet(

          pet.id,

          {

            name:
              data.name ??
              pet.name,


            singleOldPrice:
              number(
                data.singleOldPrice ??
                pet.singleOldPrice
              ),


            singlePrice:
              number(
                data.singlePrice ??
                pet.singlePrice
              ),


            pairOldPrice:
              number(
                data.pairOldPrice ??
                pet.pairOldPrice
              ),


            pairPrice:
              number(
                data.pairPrice ??
                pet.pairPrice
              ),


            type:
              data.type ??
              pet.type,


            stock:
              data.stock ??
              pet.stock ??
              "In Stock",


            image:
              data.image ??
              pet.image ??
              null,


            description:
              data.description ??
              pet.description ??
              ""

          }

        );


      if (result?.error) {

        alert(
          "Product update nahi hua ❌"
        );

        return;

      }


      alert(
        "Product Updated ✅"
      );


      // Updated data ko edit state me bhi rakho
      setEditPetData(
        prev => ({
          ...prev,
          [pet.id]: {}
        })
      );

    };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeletePet =
    async (id) => {

      const ok =
        window.confirm(
          "Product delete karna hai?"
        );


      if (!ok) return;


      const result =
        await deletePet(id);


      if (result?.error) {

        alert(
          "Product delete nahi hua ❌"
        );

        return;

      }


      alert(
        "Product Deleted ✅"
      );

    };


  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const handleAddCategory =
    async (e) => {

      e.preventDefault();


      if (!catName.trim()) {

        alert(
          "Category name enter karo"
        );

        return;

      }


      await addCategory({

        name:
          catName.trim(),

        emoji:
          catEmoji || "🐦",

        image:
          catImage || null

      });


      setCatName("");

      setCatEmoji("");

      setCatImage("");


      alert(
        "Category Added ✅"
      );

    };


  // =====================================================
  // SAVE SHIPPING
  // =====================================================

  const saveShipping = () => {

    localStorage.setItem(
      "shippingCharge",
      shippingCharge
    );


    alert(
      "Shipping Updated ✅"
    );

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="admin-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <div className="admin-sidebar">


        <h2>
          🐦 Birds Care
        </h2>


        <button
          onClick={() =>
            setActiveSection("home")
          }
        >
          🏠 Dashboard
        </button>


        <button
          onClick={() =>
            setActiveSection("products")
          }
        >
          🐦 Products
        </button>


        <button
          onClick={() =>
            setActiveSection("categories")
          }
        >
          📂 Categories
        </button>


        <button
          onClick={() =>
            setActiveSection("discount")
          }
        >
          🏷 Discount
        </button>


        <button
          onClick={() =>
            setActiveSection("orders")
          }
        >
          📦 Orders
        </button>


        <button
          onClick={() =>
            setActiveSection("shipping")
          }
        >
          🚚 Shipping
        </button>


        <button
          onClick={() =>
            setActiveSection("settings")
          }
        >
          ⚙ Settings
        </button>


      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="admin-content">


        {/* =================================================
            DASHBOARD
        ================================================= */}

        {
          activeSection === "home" &&

          <div>

            <h1>
              🐦 Birds Care Admin Dashboard
            </h1>


            <div className="dashboard-cards">


              <div className="dashboard-card">

                <h3>
                  Total Products
                </h3>

                <p>
                  {pets.length}
                </p>

              </div>


              <div className="dashboard-card">

                <h3>
                  Total Categories
                </h3>

                <p>
                  {categories.length}
                </p>

              </div>


              <div className="dashboard-card">

                <h3>
                  Available Stock
                </h3>

                <p>

                  {
                    pets.filter(
                      p =>
                        p.stock ===
                        "In Stock"
                    ).length
                  }

                </p>

              </div>


            </div>

          </div>

        }


        {/* =================================================
            PRODUCTS
        ================================================= */}

        {
          activeSection === "products" &&

          <div>

            <h1>
              🐦 Manage Products
            </h1>


            {/* =================================================
                ADD PRODUCT
            ================================================= */}

            <div className="admin-form-card">


              <h2>
                ➕ Add New Product
              </h2>


              <input
                placeholder="Product Name"
                value={name}
                onChange={
                  e =>
                    setName(
                      e.target.value
                    )
                }
              />


              <select
                value={category}
                onChange={
                  e =>
                    setCategory(
                      e.target.value
                    )
                }
              >

                <option value="">
                  Select Category
                </option>

                {
                  categories.map(
                    cat => (

                      <option
                        key={cat.id}
                        value={cat.name}
                      >
                        {cat.name}
                      </option>

                    )
                  )
                }

              </select>


              <h3>
                Single Bird Price
              </h3>


              <input
                type="number"
                placeholder="Single MRP"
                value={singleMRP}
                onChange={
                  e =>
                    setSingleMRP(
                      e.target.value
                    )
                }
              />


              <input
                type="number"
                placeholder="Single Sale Price"
                value={singlePrice}
                onChange={
                  e =>
                    setSinglePrice(
                      e.target.value
                    )
                }
              />


              <h3>
                Pair Bird Price
              </h3>


              <input
                type="number"
                placeholder="Pair MRP"
                value={pairMRP}
                onChange={
                  e =>
                    setPairMRP(
                      e.target.value
                    )
                }
              />


              <input
                type="number"
                placeholder="Pair Sale Price"
                value={pairPrice}
                onChange={
                  e =>
                    setPairPrice(
                      e.target.value
                    )
                }
              />


              {/* STOCK */}

              <select
                value={stock}
                onChange={
                  e =>
                    setStock(
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


              {/* ADD PRODUCT IMAGE */}

              <label
                style={{
                  display: "block",
                  marginTop: "10px",
                  marginBottom: "6px",
                  fontWeight: "600"
                }}
              >
                🖼 Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleBirdImage
                }
              />


              {
                image &&

                <img
                  src={image}
                  alt="Product Preview"
                  className="admin-preview"
                />

              }


              <textarea
                placeholder="Product Description"
                value={description}
                onChange={
                  e =>
                    setDescription(
                      e.target.value
                    )
                }
              />


              <button
                onClick={handleAddPet}
              >
                ➕ Add Product
              </button>


            </div>


            {/* =================================================
                EXISTING PRODUCTS
            ================================================= */}

            <div className="admin-list-grid">


              {
                pets.map(
                  pet => {

                    const currentImage =
                      editPetData[pet.id]?.image ??
                      pet.image;


                    return (

                      <div
                        className="admin-manage-card"
                        key={pet.id}
                      >


                        {/* ======================================
                            PRODUCT IMAGE
                        ====================================== */}

                        {
                          currentImage ? (

                            <img
                              src={currentImage}
                              alt={pet.name}
                              className="admin-product-image"
                            />

                          ) : (

                            <div className="admin-product-image">
                              {pet.emoji || "🐦"}
                            </div>

                          )
                        }


                        {/* ======================================
                            CHANGE IMAGE
                        ====================================== */}

                        <label
                          style={{
                            display: "block",
                            marginTop: "8px",
                            marginBottom: "5px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#374151"
                          }}
                        >
                          🖼 Product Image
                        </label>


                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            e =>
                              handleExistingBirdImage(
                                pet.id,
                                e
                              )
                          }
                        />


                        {/* IMAGE PREVIEW MESSAGE */}

                        {
                          editPetData[pet.id]?.image &&

                          <p
                            style={{
                              margin: "6px 0",
                              fontSize: "12px",
                              color: "#047857",
                              fontWeight: "600"
                            }}
                          >
                            ✅ New image selected — Update dabao
                          </p>

                        }


                        {/* ======================================
                            PRODUCT NAME
                        ====================================== */}

                        <input
                          value={
                            editPetData[pet.id]?.name ??
                            pet.name ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "name",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            SINGLE MRP
                        ====================================== */}

                        <input
                          type="number"
                          placeholder="Single MRP"
                          value={
                            editPetData[pet.id]?.singleOldPrice ??
                            pet.singleOldPrice ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "singleOldPrice",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            SINGLE PRICE
                        ====================================== */}

                        <input
                          type="number"
                          placeholder="Single Price"
                          value={
                            editPetData[pet.id]?.singlePrice ??
                            pet.singlePrice ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "singlePrice",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            PAIR MRP
                        ====================================== */}

                        <input
                          type="number"
                          placeholder="Pair MRP"
                          value={
                            editPetData[pet.id]?.pairOldPrice ??
                            pet.pairOldPrice ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "pairOldPrice",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            PAIR PRICE
                        ====================================== */}

                        <input
                          type="number"
                          placeholder="Pair Price"
                          value={
                            editPetData[pet.id]?.pairPrice ??
                            pet.pairPrice ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "pairPrice",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            CATEGORY
                        ====================================== */}

                        <select
                          value={
                            editPetData[pet.id]?.type ??
                            pet.type ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "type",
                                e.target.value
                              )
                          }
                        >

                          <option value="">
                            Select Category
                          </option>

                          {
                            categories.map(
                              cat => (

                                <option
                                  key={cat.id}
                                  value={cat.name}
                                >
                                  {cat.name}
                                </option>

                              )
                            )
                          }

                        </select>


                        {/* ======================================
                            STOCK
                        ====================================== */}

                        <select
                          value={
                            editPetData[pet.id]?.stock ??
                            pet.stock ??
                            "In Stock"
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
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


                        {/* ======================================
                            DESCRIPTION
                        ====================================== */}

                        <textarea
                          placeholder="Product Description"
                          value={
                            editPetData[pet.id]?.description ??
                            pet.description ??
                            ""
                          }
                          onChange={
                            e =>
                              changePet(
                                pet.id,
                                "description",
                                e.target.value
                              )
                          }
                        />


                        {/* ======================================
                            UPDATE
                        ====================================== */}

                        <button
                          onClick={() =>
                            handleUpdatePet(pet)
                          }
                        >
                          💾 Update
                        </button>


                        {/* ======================================
                            DELETE
                        ====================================== */}

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeletePet(
                              pet.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>


                      </div>

                    );

                  }
                )
              }


            </div>


          </div>

        }


        {/* =================================================
            CATEGORIES
        ================================================= */}

        {
          activeSection === "categories" &&

          <div>

            <h1>
              📂 Manage Categories
            </h1>


            <div className="admin-form-card">


              <input
                placeholder="Category Name"
                value={catName}
                onChange={
                  e =>
                    setCatName(
                      e.target.value
                    )
                }
              />


              <input
                placeholder="Emoji"
                value={catEmoji}
                onChange={
                  e =>
                    setCatEmoji(
                      e.target.value
                    )
                }
              />


              <input
                type="file"
                accept="image/*"
                onChange={
                  handleCategoryImage
                }
              />


              {
                catImage &&

                <img
                  src={catImage}
                  alt="Category Preview"
                  className="admin-preview"
                />

              }


              <button
                onClick={handleAddCategory}
              >
                ➕ Add Category
              </button>


            </div>


            <div className="category-list">


              {
                categories.map(
                  cat => (

                    <div
                      className="category-admin-card"
                      key={cat.id}
                    >


                      {
                        cat.image ? (

                          <img
                            src={cat.image}
                            alt={cat.name}
                          />

                        ) : (

                          <div>
                            {cat.emoji}
                          </div>

                        )
                      }


                      <h3>
                        {cat.name}
                      </h3>


                      <button
                        className="delete-category"
                        onClick={() =>
                          removeCategory(
                            cat.id
                          )
                        }
                      >
                        🗑 Delete
                      </button>


                    </div>

                  )
                )
              }


            </div>


          </div>

        }


        {/* =================================================
            DISCOUNT
        ================================================= */}

        {
          activeSection === "discount" &&

          <div>

            <h1>
              🏷 Discount Management
            </h1>


            <div className="admin-list-grid">


              {
                pets.map(
                  pet => (

                    <div
                      className="admin-manage-card"
                      key={pet.id}
                    >


                      <h3>
                        {pet.name}
                      </h3>


                      <label>
                        Single Discount %
                      </label>


                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          pet.single_discount ||
                          0
                        }
                        onChange={
                          async e => {

                            const value =
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(
                                    e.target.value
                                  ) || 0
                                )
                              );


                            await updatePet(

                              pet.id,

                              {
                                single_discount:
                                  value
                              }

                            );

                          }
                        }
                      />


                      <label>
                        Pair Discount %
                      </label>


                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          pet.pair_discount ||
                          0
                        }
                        onChange={
                          async e => {

                            const value =
                              Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(
                                    e.target.value
                                  ) || 0
                                )
                              );


                            await updatePet(

                              pet.id,

                              {
                                pair_discount:
                                  value
                              }

                            );

                          }
                        }
                      />


                      <p>

                        Single Discount:

                        {" "}

                        {
                          pet.single_discount ||
                          0
                        }%

                      </p>


                      <p>

                        Pair Discount:

                        {" "}

                        {
                          pet.pair_discount ||
                          0
                        }%

                      </p>


                      <button
                        onClick={() =>
                          alert(
                            "Discount Updated ✅"
                          )
                        }
                      >
                        💾 Save Discount
                      </button>


                    </div>

                  )
                )
              }


            </div>


          </div>

        }


        {/* =================================================
            ORDERS
        ================================================= */}

        {
          activeSection === "orders" &&

          <div>

            <h1>
              📦 Orders Management
            </h1>


            <OrdersPage />


          </div>

        }


        {/* =================================================
            SHIPPING
        ================================================= */}

        {
          activeSection === "shipping" &&

          <div>

            <h1>
              🚚 Shipping Settings
            </h1>


            <div className="admin-form-card">


              <input
                type="number"
                min="0"
                placeholder="Shipping Charge"
                value={shippingCharge}
                onChange={
                  e =>
                    setShippingCharge(
                      e.target.value
                    )
                }
              />


              <button
                onClick={saveShipping}
              >
                💾 Save Shipping
              </button>


            </div>


          </div>

        }


        {/* =================================================
            SETTINGS
        ================================================= */}

        {
          activeSection === "settings" &&

          <div>

            <h1>
              ⚙ Settings
            </h1>


            <div className="admin-form-card">


              <h2>
                🐦 Birds Care Admin Panel
              </h2>


              <p>
                Website management settings
              </p>


            </div>


          </div>

        }


      </div>


    </div>

  );

}


export default Admin;