import { Link } from "react-router-dom";
import { useContext } from "react";

import { CategoryContext } from "../context/CategoryContext";
import { PetContext } from "../context/PetContext";


function Categories() {


const { categories } = useContext(CategoryContext);
const { pets } = useContext(PetContext);



return (

<div className="categories-container">


{
categories.map((category)=>{


const count = pets.filter(
(pet)=> pet.type === category.name
).length;



return (


<Link

key={category.id}

to={`/products?type=${encodeURIComponent(category.name)}`}

className="category-card"

>



{
category.image ? (

<img

src={category.image}

alt={category.name}

/>

)

:

(

<div className="category-placeholder">

{category.emoji || "🐦"}

</div>

)

}




<h3>
{category.name}
</h3>



<p>
{count} Birds
</p>



</Link>


)


})

}



</div>


);


}


export default Categories;