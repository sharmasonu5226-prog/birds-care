import {
  useContext,
  useState
} from "react";

import {
  Link,
  useSearchParams
} from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";



function Products(){

  const {
    addToCart
  } = useContext(CartContext);



  const {
    pets
  } = useContext(PetContext);



  const [search,setSearch] =
    useState("");



  const [searchParams] =
    useSearchParams();



  const categoryType =
    searchParams.get("type");




  const filteredPets =
    Array.isArray(pets)

    ?

    pets.filter((bird)=>{


      const nameMatch =
        String(bird.name || "")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );



      const categoryMatch =
        !categoryType ||
        String(bird.type || "")
        .toLowerCase()
        ===
        String(categoryType)
        .toLowerCase();



      return (
        nameMatch &&
        categoryMatch
      );


    })

    :

    [];




return(

<div className="products-page">


<h1>
{
categoryType ||
"All Birds"
}
</h1>



<input

type="text"

placeholder="Search Bird..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

/>




{
filteredPets.length===0

?

<div className="no-products">

<h2>
No Birds Found
</h2>

</div>


:

<div className="products-grid">


{
filteredPets.map((bird)=>(

<BirdCard

key={bird.id}

bird={bird}

addToCart={addToCart}

/>

))

}


</div>

}


</div>

);


}





function getNumber(value){

const num =
Number(value);


return Number.isFinite(num)
?
num
:
0;

}





function getDiscount(oldPrice,newPrice){

if(
oldPrice<=0 ||
newPrice<=0 ||
oldPrice<=newPrice
){

return 0;

}


return Math.round(
(
(oldPrice-newPrice)
/
oldPrice
)
*
100
);

}





function BirdCard({
bird,
addToCart
}){


const singleOldPrice =
getNumber(
bird.singleOldPrice ??
bird.price
);



const singlePrice =
getNumber(
bird.singlePrice ??
bird.price
);



const pairOldPrice =
getNumber(
bird.pairOldPrice ??
singleOldPrice * 2
);



const pairPrice =
getNumber(
bird.pairPrice ??
singlePrice * 2
);



const singleDiscount =
getDiscount(
singleOldPrice,
singlePrice
);



const pairDiscount =
getDiscount(
pairOldPrice,
pairPrice
);



const stock =
String(
bird.stock ||
"In Stock"
);



const outStock =
stock.toLowerCase()
===
"out of stock";



const [
showPair,
setShowPair
]=useState(false);



const [bird1Age,setBird1Age]=
useState("Young");


const [bird1Gender,setBird1Gender]=
useState("Male");


const [bird2Age,setBird2Age]=
useState("Young");


const [bird2Gender,setBird2Gender]=
useState("Female");





const addSingle=()=>{


if(outStock)return;


addToCart(

{

...bird,

price:singlePrice,

originalPrice:singleOldPrice,

singleOldPrice,

singlePrice,

pairOldPrice,

pairPrice,

purchaseType:"Single",

age:"Young",

gender:"Male"

},

{
quantity:1
}

);


};// ===============================
// ADD PAIR
// ===============================

const addPair = ()=>{


if(outStock)
return;



addToCart(

{

...bird,


price:
pairPrice,


originalPrice:
pairOldPrice,


singleOldPrice,

singlePrice,


pairOldPrice,

pairPrice,


purchaseType:
"Pair",



pairBirds:[

{

birdNumber:1,

age:bird1Age,

gender:bird1Gender

},


{

birdNumber:2,

age:bird2Age,

gender:bird2Gender

}

]


},

{
quantity:1
}

);



setShowPair(false);


};





return (

<div className="product-card">



<div className="product-image">


{

bird.image ?


<img

src={bird.image}

alt={bird.name}

/>


:


<div className="product-emoji">

{bird.emoji || "🐦"}

</div>


}


</div>




<h2>
{bird.name}
</h2>


<p>
{bird.type}
</p>





<div className="price-box">


<h3>
🐦 Single Bird
</h3>



{
singleDiscount > 0 &&

<span className="old-price">
₹{singleOldPrice}
</span>

}



<strong>
₹{singlePrice}
</strong>



{
singleDiscount > 0 &&

<span className="discount">
{singleDiscount}% OFF
</span>

}



<button

disabled={outStock}

onClick={addSingle}

>

{
outStock
?
"Out of Stock"
:
"🛒 Add Single"
}

</button>


</div>





<div className="price-box">


<h3>
🐦🐦 Pair (2 Birds)
</h3>



{
pairDiscount > 0 &&

<span className="old-price">
₹{pairOldPrice}
</span>

}



<strong>
₹{pairPrice}
</strong>



{
pairDiscount > 0 &&

<span className="discount">
{pairDiscount}% OFF
</span>

}





{

!showPair ?


<button

disabled={outStock}

onClick={()=>
setShowPair(true)
}

>

🛒 Select Pair

</button>



:


<div className="pair-options">


<h4>Bird 1</h4>


<button onClick={()=>setBird1Age("Young")}>
🐣 Young
</button>


<button onClick={()=>setBird1Age("Adult")}>
🐦 Adult
</button>


<button onClick={()=>setBird1Gender("Male")}>
♂ Male
</button>


<button onClick={()=>setBird1Gender("Female")}>
♀ Female
</button>





<h4>Bird 2</h4>


<button onClick={()=>setBird2Age("Young")}>
🐣 Young
</button>


<button onClick={()=>setBird2Age("Adult")}>
🐦 Adult
</button>


<button onClick={()=>setBird2Gender("Male")}>
♂ Male
</button>


<button onClick={()=>setBird2Gender("Female")}>
♀ Female
</button>




<button onClick={addPair}>
🛒 Add Pair
</button>



<button onClick={()=>setShowPair(false)}>
Cancel
</button>



</div>


}



</div>





<p

className={
outStock
?
"stock-red"
:
"stock-green"
}

>

{
outStock
?
"Out of Stock"
:
"In Stock"
}

</p>





<Link

to={`/product/${bird.id}`}

className="view-details-button"

>

View Details

</Link>




</div>


);


}



export default Products;