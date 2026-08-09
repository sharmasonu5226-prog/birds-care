import { createContext, useState } from "react";


export const CartContext = createContext();



function CartProvider({children}){


const [cart,setCart] = useState(()=>{


const saved = localStorage.getItem("cart");


return saved ? JSON.parse(saved) : [];


});





const addToCart = (bird)=>{


const updated = [

...cart,

bird

];


setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);


};







const removeFromCart = (id)=>{


const updated = cart.filter(

(item)=> item.id !== id

);



setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);



};







const clearCart = ()=>{


setCart([]);


localStorage.removeItem("cart");


};






return (


<CartContext.Provider


value={{

cart,

addToCart,

removeFromCart,

clearCart

}}


>


{children}


</CartContext.Provider>



);


}



export default CartProvider;