import { useContext } from "react";

import { CartContext } from "../context/CartContext";


function Cart(){


const { cart, removeFromCart, clearCart } = useContext(CartContext);





const total = cart.reduce(

(sum,item)=>sum + Number(item.price),

0

);







return (


<section className="cart-page">





<h1>

Your Cart 🛒

</h1>








{

cart.length === 0 ?



(



<div className="empty-cart">


<h2>

Cart is Empty 🛒

</h2>


<p>

Add some beautiful birds to your cart.

</p>



</div>



)



:

(



<div className="cart-list">





{

cart.map((item)=>(




<div

className="cart-card"

key={item.id}

>







<div className="cart-image">



<img

src={item.image}

alt={item.name}

className="cart-img"

/>



</div>








<div className="cart-info">


<h3>

{item.name}

</h3>



<p>

₹{item.price}

</p>



</div>








<button

onClick={()=>removeFromCart(item.id)}

>


❌ Remove


</button>







</div>





))


}







<div className="cart-total">


<h2>

Total: ₹{total}

</h2>






<button

className="clear-btn"

onClick={clearCart}

>


Clear Cart


</button>



</div>





</div>



)



}







</section>



);


}



export default Cart;