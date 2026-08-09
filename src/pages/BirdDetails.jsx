import { useContext } from "react";
import { useParams } from "react-router-dom";


import { PetContext } from "../context/PetContext";
import { CartContext } from "../context/CartContext";



function BirdDetails(){


const { id } = useParams();


const { pets } = useContext(PetContext);


const { addToCart } = useContext(CartContext);





const bird = pets.find(

(item)=>item.id === Number(id)

);







if(!bird){


return (

<h2>

Bird Not Found

</h2>

);


}







return (


<section className="details-page">



<div className="details-card">





<div className="details-image">


{


bird.image?.startsWith("http")


?


<img

src={bird.image}

alt={bird.name}

className="details-img"

/>



:


<div className="emoji-image">

{bird.image}

</div>



}





</div>









<div className="details-content">



<h1>

{bird.name}

</h1>





<h2>

₹{bird.price}

</h2>






<p>

{

bird.description ||

"Healthy and beautiful pet bird available with proper care."

}


</p>






<p>

<strong>Category:</strong> {bird.type}

</p>







<button

onClick={()=>addToCart(bird)}

>

🛒 Add To Cart

</button>






</div>







</div>




</section>


);



}



export default BirdDetails;