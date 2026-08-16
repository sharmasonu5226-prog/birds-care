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
  const [catImage, setCatImage] = useState("");

  const [editCategory, setEditCategory] = useState({});


  const readImage = (file, callback) => {

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Sirf image file select karo");
      return;
    }


    const reader = new FileReader();


    reader.onload = () => {
      callback(reader.result);
    };


    reader.readAsDataURL(file);

  };



  const handleAddImage = (e) => {

    const file = e.target.files[0];

    readImage(file, (img) => {
      setCatImage(img);
    });

  };



  const handleEditImage = (e, id) => {

    const file = e.target.files[0];

    readImage(file, (img) => {

      setEditCategory(prev => ({
        ...prev,

        [id]: {
          ...(prev[id] || {}),
          image: img
        }

      }));

    });

  };



  const addNewCategory = async () => {


    if (!catName.trim()) {

      alert("Category name enter karo");
      return;

    }


    await addCategory({

      name: catName.trim(),

      emoji: catEmoji || "🐦",

      image: catImage || null

    });


    setCatName("");
    setCatEmoji("");
    setCatImage("");

    alert("Category Added");

  };




  const changeField = (id, field, value) => {


    setEditCategory(prev => ({

      ...prev,

      [id]: {

        ...(prev[id] || {}),

        [field]: value

      }

    }));


  };




  const updateCat = async (category) => {


    const edit = editCategory[category.id] || {};


    await updateCategory(

      category.id,

      {

        name: edit.name ?? category.name,

        emoji: edit.emoji ?? category.emoji,

        image: edit.image ?? category.image

      }

    );


    alert("Category Updated");


  };




  const deleteCat = async (id) => {


    const ok = window.confirm(
      "Category delete karni hai?"
    );


    if (ok) {

      await removeCategory(id);

    }

  };




  const getImage = (category) => {


    return (
      editCategory[category.id]?.image ||
      category.image ||
      null
    );


  };




  return (

    <div className="admin-page category-admin-page">


      <h1>
        Manage Categories
      </h1>



      <div className="category-add-box">


        <h2>
          Add Category
        </h2>


        <input
          type="text"
          placeholder="Category Name"
          value={catName}
          onChange={(e)=>setCatName(e.target.value)}
        />


        <input
          type="text"
          placeholder="Emoji"
          value={catEmoji}
          onChange={(e)=>setCatEmoji(e.target.value)}
        />


        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
        />



        {
          catImage &&

          <img
            className="category-preview"
            src={catImage}
            alt="preview"
          />

        }



        <button onClick={addNewCategory}>
          Add Category
        </button>


      </div>





      <div className="category-list">


        {
          categories.length === 0 ?

          <p>No categories found</p>


          :


          categories.map(category => {


            const image = getImage(category);



            return (

              <div
                className="category-admin-card"
                key={category.id}
              >



                {
                  image ?


                  <img
                    className="category-admin-image"
                    src={image}
                    alt={category.name}
                  />


                  :


                  <div className="category-placeholder">

                    {category.emoji || "🐦"}

                  </div>


                }




                <input

                  value={
                    editCategory[category.id]?.name ??
                    category.name ??
                    ""
                  }

                  onChange={(e)=>
                    changeField(
                      category.id,
                      "name",
                      e.target.value
                    )
                  }

                />



                <input

                  value={
                    editCategory[category.id]?.emoji ??
                    category.emoji ??
                    ""
                  }

                  onChange={(e)=>
                    changeField(
                      category.id,
                      "emoji",
                      e.target.value
                    )
                  }

                />



                <input

                  type="file"

                  accept="image/*"

                  onChange={(e)=>
                    handleEditImage(
                      e,
                      category.id
                    )
                  }

                />



                <button
                  onClick={() =>
                    updateCat(category)
                  }
                >
                  Update
                </button>



                <button
                  className="delete-category"
                  onClick={() =>
                    deleteCat(category.id)
                  }
                >
                  Delete
                </button>



              </div>

            );


          })

        }


      </div>



    </div>

  );

}


export default CategoryPage;