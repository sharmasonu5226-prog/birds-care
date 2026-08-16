import { useContext, useState } from "react";

import { PetContext } from "../context/PetContext";
import { CategoryContext } from "../context/CategoryContext";


function BirdsPage(){

  const {
    pets,
    addPet,
    deletePet,
    updatePet
  } = useContext(PetContext);


  const {
    categories
  } = useContext(CategoryContext);



  const [name,setName] = useState("");

  const [singleOldPrice,setSingleOldPrice] = useState("");

  const [singlePrice,setSinglePrice] = useState("");

  const [pairOldPrice,setPairOldPrice] = useState("");

  const [pairPrice,setPairPrice] = useState("");

  const [type,setType] = useState("");

  const [image,setImage] = useState("");

  const [description,setDescription] = useState("");

  const [stock,setStock] = useState("In Stock");



  const [editBird,setEditBird] = useState({});




  const calculateDiscount = (
    oldPrice,
    newPrice
  )=>{

    const oldValue = Number(oldPrice)||0;

    const newValue = Number(newPrice)||0;


    if(
      oldValue<=0 ||
      newValue<=0 ||
      oldValue<=newValue
    ){

      return 0;

    }


    return Math.round(
      ((oldValue-newValue)/
      oldValue)*100
    );

  };





  const readImage=(file,callback)=>{

    const reader = new FileReader();


    reader.onload=()=>{

      callback(
        reader.result
      );

    };


    reader.readAsDataURL(file);

  };




  const handleBirdImage=(e)=>{

    const file=e.target.files[0];


    if(!file)
      return;


    readImage(
      file,
      (img)=>{

        setImage(img);

      }
    );

  };




  const handleAddBird=async(e)=>{

    e.preventDefault();


    if(
      !name ||
      !singlePrice ||
      !pairPrice ||
      !type
    ){

      alert(
        "Complete bird details"
      );

      return;

    }



    const result =
      await addPet({

        name:name.trim(),

        price:Number(singlePrice),

        singleOldPrice:
          Number(singleOldPrice),

        singlePrice:
          Number(singlePrice),

        pairOldPrice:
          Number(pairOldPrice),

        pairPrice:
          Number(pairPrice),

        type,

        image,

        description,

        stock

      });



    if(!result?.error){

      alert(
        "Bird Added Successfully"
      );


      setName("");

      setSingleOldPrice("");

      setSinglePrice("");

      setPairOldPrice("");

      setPairPrice("");

      setType("");

      setImage("");

      setDescription("");

      setStock("In Stock");

    }


  };  const changeBird = (
    id,
    field,
    value
  )=>{

    setEditBird((prev)=>({

      ...prev,

      [id]:{

        ...(prev[id] || {}),

        [field]:value

      }

    }));

  };




  const handleEditBirdImage = (
    e,
    id
  )=>{

    const file =
      e.target.files[0];


    if(!file)
      return;


    readImage(
      file,
      (img)=>{


        setEditBird((prev)=>({


          ...prev,


          [id]:{


            ...(prev[id] || {}),


            image:img


          }


        }));


      }
    );


  };





  const handleUpdateBird = async(
    bird
  )=>{


    const edit =
      editBird[bird.id] || {};



    await updatePet(

      bird.id,

      {


        name:
          edit.name ??
          bird.name,



        price:
          Number(
            edit.singlePrice ??
            bird.singlePrice ??
            bird.price ??
            0
          ),



        singleOldPrice:
          Number(
            edit.singleOldPrice ??
            bird.singleOldPrice ??
            0
          ),



        singlePrice:
          Number(
            edit.singlePrice ??
            bird.singlePrice ??
            bird.price ??
            0
          ),



        pairOldPrice:
          Number(
            edit.pairOldPrice ??
            bird.pairOldPrice ??
            0
          ),



        pairPrice:
          Number(
            edit.pairPrice ??
            bird.pairPrice ??
            0
          ),



        type:
          edit.type ??
          bird.type,



        image:
          edit.image ??
          bird.image,



        description:
          edit.description ??
          bird.description,



        stock:
          edit.stock ??
          bird.stock ??
          "In Stock"


      }

    );



    setEditBird((prev)=>{


      const copy={
        ...prev
      };


      delete copy[bird.id];


      return copy;


    });



    alert(
      "Bird Updated Successfully"
    );


  };





  const handleDeleteBird=(id)=>{


    if(
      window.confirm(
        "Delete this bird?"
      )
    ){

      deletePet(id);

    }

  };





  return (

    <div className="admin-content">


      <h1>
        🐦 Manage Birds
      </h1>



      <div className="add-box">


        <h2>
          Add New Bird
        </h2>



        <form
          onSubmit={handleAddBird}
        >


          <input

            type="text"

            placeholder="Bird Name"

            value={name}

            onChange={(e)=>
              setName(e.target.value)
            }

          />



          <input

            type="number"

            placeholder="Single Original Price"

            value={singleOldPrice}

            onChange={(e)=>
              setSingleOldPrice(
                e.target.value
              )
            }

          />



          <input

            type="number"

            placeholder="Single Selling Price"

            value={singlePrice}

            onChange={(e)=>
              setSinglePrice(
                e.target.value
              )
            }

          />



          <input

            type="number"

            placeholder="Pair Original Price"

            value={pairOldPrice}

            onChange={(e)=>
              setPairOldPrice(
                e.target.value
              )
            }

          />



          <input

            type="number"

            placeholder="Pair Selling Price"

            value={pairPrice}

            onChange={(e)=>
              setPairPrice(
                e.target.value
              )
            }

          />



          <select

            value={type}

            onChange={(e)=>
              setType(
                e.target.value
              )
            }

          >

            <option value="">
              Select Category
            </option>


            {
              categories.map((cat)=>(

                <option
                  key={cat.id}
                  value={cat.name}
                >

                  {cat.name}

                </option>

              ))
            }


          </select>          <input

            type="file"

            accept="image/*"

            onChange={
              handleBirdImage
            }

          />



          <textarea

            placeholder="Bird Description"

            value={description}

            onChange={(e)=>
              setDescription(
                e.target.value
              )
            }

          />



          <select

            value={stock}

            onChange={(e)=>
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



          <button type="submit">

            ➕ Add Bird

          </button>


        </form>


      </div>





      <div className="bird-list">


        {
          pets.map((bird)=>(


            <div

              key={bird.id}

              className="bird-admin-card"

            >


              {

                bird.image ?

                <img

                  src={bird.image}

                  alt={bird.name}

                />

                :

                <div className="no-image">

                  🐦

                </div>

              }



              <div className="admin-bird-info">



                <input

                  value={
                    editBird[bird.id]?.name ??
                    bird.name
                  }

                  onChange={(e)=>

                    changeBird(

                      bird.id,

                      "name",

                      e.target.value

                    )

                  }

                />




                <input

                  type="number"

                  placeholder="Single Price"

                  value={

                    editBird[bird.id]
                    ?.singlePrice ??
                    bird.singlePrice ??
                    bird.price

                  }


                  onChange={(e)=>

                    changeBird(

                      bird.id,

                      "singlePrice",

                      e.target.value

                    )

                  }

                />





                <input

                  type="number"

                  placeholder="Pair Price"

                  value={

                    editBird[bird.id]
                    ?.pairPrice ??
                    bird.pairPrice ??
                    ""

                  }


                  onChange={(e)=>

                    changeBird(

                      bird.id,

                      "pairPrice",

                      e.target.value

                    )

                  }

                />





                <select

                  value={

                    editBird[bird.id]
                    ?.type ??
                    bird.type

                  }


                  onChange={(e)=>

                    changeBird(

                      bird.id,

                      "type",

                      e.target.value

                    )

                  }

                >

                  {
                    categories.map((cat)=>(

                      <option

                        key={cat.id}

                        value={cat.name}

                      >

                        {cat.name}

                      </option>

                    ))
                  }


                </select>





                <input

                  type="file"

                  accept="image/*"

                  onChange={(e)=>

                    handleEditBirdImage(

                      e,

                      bird.id

                    )

                  }

                />





                <textarea

                  value={

                    editBird[bird.id]
                    ?.description ??
                    bird.description ??
                    ""

                  }


                  onChange={(e)=>

                    changeBird(

                      bird.id,

                      "description",

                      e.target.value

                    )

                  }

                />





                <select

                  value={

                    editBird[bird.id]
                    ?.stock ??
                    bird.stock ??
                    "In Stock"

                  }


                  onChange={(e)=>

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





                <button

                  onClick={()=>
                    handleUpdateBird(
                      bird
                    )
                  }

                >

                  💾 Update

                </button>





                <button

                  onClick={()=>
                    handleDeleteBird(
                      bird.id
                    )
                  }

                >

                  🗑 Delete

                </button>



              </div>


            </div>


          ))

        }


      </div>


    </div>

  );


}


export default BirdsPage;