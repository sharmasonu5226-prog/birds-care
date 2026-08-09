import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";


function Checkout(){


  const { cart } = useContext(CartContext);



  const [form,setForm] = useState({

    name:"",
    mobile:"",
    address:""

  });




  const total = cart.reduce(

    (sum,item)=> 
    sum + Number(item.price.replace("₹","").replace(",","")),

    0

  );





  const changeHandler=(e)=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };






  const submitOrder=(e)=>{


    e.preventDefault();


    alert(

      "Order Placed Successfully 🎉"

    );


  };





  return (

    <section className="checkout-page">


      <h1>

        🧾 Checkout

      </h1>



      <div className="checkout-box">


        <form onSubmit={submitOrder}>


          <input

            name="name"

            placeholder="Your Name"

            value={form.name}

            onChange={changeHandler}

          />



          <input

            name="mobile"

            placeholder="Mobile Number"

            value={form.mobile}

            onChange={changeHandler}

          />



          <textarea

            name="address"

            placeholder="Full Address"

            value={form.address}

            onChange={changeHandler}

          />



          <h2>

            Total Amount: ₹{total}

          </h2>




          <button>

            Place Order

          </button>


        </form>


      </div>



    </section>

  );


}



export default Checkout;