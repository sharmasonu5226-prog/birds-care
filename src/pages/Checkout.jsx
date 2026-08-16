import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { supabase } from "../supabaseClient";


function Checkout() {


  const navigate = useNavigate();



  const {
    cart,
    clearCart
  } = useContext(CartContext);



  // =========================
  // FORM
  // =========================


  const [form,setForm] = useState({

    name:"",
    mobile:"",
    email:"",
    address:"",
    city:"",
    pincode:"",

  });



  const [loading,setLoading] =
  useState(false);




  // =========================
  // PRICE
  // =========================


  const getPrice = (item)=>{

    return Number(

      String(item?.price || 0)

      .replace("₹","")

      .replace(/,/g,"")

      .trim()

    ) || 0;

  };




  const getQuantity = (item)=>{

    const qty =
    Number(
      item?.quantity ||
      item?.qty ||
      1
    );


    return qty > 0 ? qty : 1;

  };




  // =========================
  // SUBTOTAL
  // =========================


  const subtotal = cart.reduce(

    (sum,item)=>{

      return (
        sum +
        getPrice(item) *
        getQuantity(item)
      );

    },

    0

  );





  // =========================
  // ADMIN DISCOUNT
  // =========================


  const adminDiscount =

  Number(

    localStorage.getItem(
      "birdsCareDiscount"
    ) || 0

  );





  const discount =

  Math.round(

    (subtotal * adminDiscount) / 100

  );






  // =========================
  // ADMIN SHIPPING
  // =========================


  const deliveryCharge =

  Number(

    localStorage.getItem(
      "birdsCareShipping"
    ) || 0

  );






  // =========================
  // FINAL TOTAL
  // =========================


  const total =

  Math.max(

    0,

    subtotal -

    discount +

    deliveryCharge

  );




  // =========================
  // INPUT CHANGE
  // =========================


  const changeHandler=(e)=>{


    const {
      name,
      value
    } = e.target;



    setForm((prev)=>({

      ...prev,

      [name]:value

    }));


  };  // =========================
  // SUBMIT ORDER
  // =========================


  const submitOrder = async(e)=>{


    e.preventDefault();



    if(cart.length===0){

      alert(
        "Cart is empty 🛒"
      );

      return;

    }




    if(

      !form.name.trim() ||

      !form.mobile.trim() ||

      !form.email.trim() ||

      !form.address.trim() ||

      !form.city.trim() ||

      !form.pincode.trim()

    ){

      alert(
        "Please fill all details ❌"
      );

      return;

    }




    try{


      setLoading(true);




      const orderId =

      "BC" + Date.now();




      const orderDate =

      new Date()

      .toLocaleString(
        "en-IN"
      );





      const billData = {


        orderId,


        orderDate,


        orderStatus:
        "Confirmed",



        paymentMethod:
        "Cash on Delivery",



        paymentStatus:
        "Pending",




        customer:{


          name:
          form.name.trim(),



          mobile:
          form.mobile.trim(),



          email:
          form.email.trim(),



          address:
          form.address.trim(),



          city:
          form.city.trim(),



          pincode:
          form.pincode.trim(),


        },




        items:cart,



        subtotal,



        discount,



        discountPercent:
        adminDiscount,



        deliveryCharge,



        total,



      };






      // =========================
      // SAVE ORDER SUPABASE
      // =========================


      const {
        error
      } = await supabase

      .from("orders")

      .insert([

        {


          order_id:
          orderId,



          order_status:
          "Confirmed",



          payment_method:
          "Cash on Delivery",



          payment_status:
          "Pending",




          customer_name:
          form.name.trim(),



          customer_mobile:
          form.mobile.trim(),



          customer_email:
          form.email.trim(),



          customer_address:
          form.address.trim(),



          customer_city:
          form.city.trim(),



          customer_pincode:
          form.pincode.trim(),




          items:cart,



          subtotal,



          discount,



          delivery_charge:
          deliveryCharge,



          total,



        }

      ]);






      if(error){


        console.log(
          "SUPABASE ERROR:",
          error
        );


        throw new Error(
          "Order save nahi hua"
        );


      }





      // =========================
      // SAVE BILL
      // =========================


      localStorage.setItem(

        "birdsCareLastOrder",

        JSON.stringify(
          billData
        )

      );






      const savedBill =

      localStorage.getItem(

        "birdsCareLastOrder"

      );





      if(!savedBill){


        throw new Error(
          "Bill save nahi hua"
        );


      }






      clearCart();





      alert(
        "Order placed successfully 🎉"
      );





      navigate(
        "/bill"
      );



    }



    catch(error){


      console.error(
        "ORDER ERROR:",
        error
      );



      alert(

        "Order failed ❌\n\n" +

        error.message

      );


    }



    finally{


      setLoading(false);


    }


  };  // =========================
  // PAGE
  // =========================

  return (

    <section className="checkout-section">


      <div className="checkout-box">


        <h1>
          🧾 Checkout
        </h1>




        <form
          onSubmit={submitOrder}
        >




          <input

            name="name"

            type="text"

            placeholder="Full Name"

            value={form.name}

            onChange={changeHandler}

            required

          />





          <input

            name="mobile"

            type="tel"

            placeholder="Mobile Number"

            value={form.mobile}

            onChange={changeHandler}

            required

          />





          <input

            name="email"

            type="email"

            placeholder="Gmail Address"

            value={form.email}

            onChange={changeHandler}

            required

          />





          <textarea

            name="address"

            placeholder="Full Delivery Address"

            value={form.address}

            onChange={changeHandler}

            required

          />





          <input

            name="city"

            type="text"

            placeholder="City"

            value={form.city}

            onChange={changeHandler}

            required

          />





          <input

            name="pincode"

            type="text"

            placeholder="Pincode"

            value={form.pincode}

            onChange={changeHandler}

            required

          />







          {/* ORDER SUMMARY */}


          <div className="checkout-summary">


            <h3>
              Order Summary
            </h3>





            <p>

              <span>
                Subtotal
              </span>


              <strong>

                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}

              </strong>


            </p>







            <p>

              <span>
                Discount ({adminDiscount}%)
              </span>


              <strong
                style={{
                  color:"green"
                }}
              >

                - ₹
                {discount.toLocaleString(
                  "en-IN"
                )}

              </strong>


            </p>







            <p>

              <span>
                Shipping
              </span>


              <strong>

                {
                  deliveryCharge === 0

                  ?

                  "FREE"

                  :

                  `₹${deliveryCharge.toLocaleString(
                    "en-IN"
                  )}`

                }

              </strong>


            </p>







            <hr />






            <h2>


              <span>
                Final Total
              </span>



              <strong>

                ₹
                {total.toLocaleString(
                  "en-IN"
                )}

              </strong>



            </h2>





          </div>








          <button

            type="submit"

            disabled={loading}

          >


            {

              loading

              ?

              "Placing Order..."

              :

              "Confirm Order"

            }


          </button>






          <button

            type="button"

            onClick={()=>navigate("/cart")}

            disabled={loading}

          >

            Cancel

          </button>





        </form>



      </div>



    </section>

  );


}



export default Checkout;