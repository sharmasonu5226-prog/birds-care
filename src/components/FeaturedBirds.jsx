import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";


function FeaturedBirds() {


const { addToCart } = useContext(CartContext);

const { pets } = useContext(PetContext);


const [searchParams] = useSearchParams();


const selectedCategory = searchParams.get("type");



const categoryBirds = selectedCategory

? pets.filter(
(bird)=> bird.type === selectedCategory
)

: pets;





return (

<section className="featured">


<h2 className="section-title">

{
selectedCategory
?
`${selectedCategory} Birds`
:
"Featured Birds"
}

</h2>




<div className="featured-grid">


{

categoryBirds.length === 0 ?


(

<div className="empty-admin">

<div>🐦</div>

<h3>
No Birds Found
</h3>

<p>
This category has no birds available.
</p>

</div>

)


:


categoryBirds.map((bird)=>(


<div

className="bird-card"

key={bird.id}

>



{
bird.image

?


<img

className="bird-img"

src={bird.image}

alt={bird.name}

/>


:


<div className="bird-img no-image">

{bird.emoji || "🐦"}

</div>


}




<h3>

{bird.name}

</h3>




<p className="price">

₹{bird.price}

</p>





<div className="rating">

⭐⭐⭐⭐⭐

<span>

({bird.id * 20})

</span>

</div>





{/* STOCK */}

{

bird.stock === "Out of Stock"

?


<p className="stock-red">

❌ Out of Stock

</p>


:


<p className="stock-green">

✅ In Stock

</p>


}





<div className="bird-buttons">





<button


disabled={
bird.stock === "Out of Stock"
}


onClick={()=>{

if(
bird.stock === "Out of Stock"
){

alert(
"This bird is Out of Stock ❌"
);

return;

}


addToCart(bird);


}}



style={{

opacity:

bird.stock === "Out of Stock"

?

0.5

:

1,


cursor:

bird.stock === "Out of Stock"

?

"not-allowed"

:

"pointer"


}}


>


{

bird.stock === "Out of Stock"

?

"❌ Out of Stock"

:

"🛒 Add Cart"

}


</button>





<Link

className="details-btn"

to={`/bird/${bird.id}`}

>

View Details

</Link>




</div>



</div>



))


}



</div>



</section>


);


}


export default FeaturedBirds;