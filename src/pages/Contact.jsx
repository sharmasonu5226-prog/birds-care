import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";



function Products(){


  const { addToCart } = useContext(CartContext);

  const { pets } = useContext(PetContext);



  const [search, setSearch] = useState("");

  const [type, setType] = useState("All");





  const filteredPets = pets.filter((bird)=>{


    const nameMatch = bird.name

      .toLowerCase()

      .includes(

        search.toLowerCase()

      );



    const typeMatch =

      type === "All"

      ||

      bird.type === type;



    return nameMatch && typeMatch;


  });






  return (

    <section className="products-page">


      <h1>

        All Pets

      </h1>





      <div className="filter-box">


        <input

          type="text"

          placeholder="Search Pet..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

        />





        <select

          value={type}

          onChange={(e)=>setType(e.target.value)}

        >


          <option value="All">

            All Pets

          </option>



          <option value="Bird">

            Birds

          </option>



          <option value="Cat">

            Cats

          </option>



          <option value="Small Pet">

            Small Pets

          </option>


        </select>


      </div>







      <div className="products-grid">


        {

          filteredPets.length === 0 ?


          (

            <h2>

              No Pet Found

            </h2>

          )


          :


          filteredPets.map((bird)=>(


            <div

              className="product-card"

              key={bird.id}

            >



              <div className="product-image">

                {bird.image}

              </div>




              <h3>

                {bird.name}

              </h3>




              <p>

                {bird.price}

              </p>




              <button

                onClick={()=>addToCart(bird)}

              >

                🛒 Add To Cart

              </button>





              <Link to={`/bird/${bird.id}`}>

                <button className="details-btn">

                  View Details

                </button>


              </Link>



            </div>


          ))

        }



      </div>



    </section>

  );


}



export default Products;