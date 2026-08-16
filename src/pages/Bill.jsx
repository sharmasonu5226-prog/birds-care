import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bill() {

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);


  // =========================
  // LOAD ORDER
  // =========================

  useEffect(() => {

    const savedOrder =
      localStorage.getItem(
        "birdsCareLastOrder"
      );


    if(savedOrder){

      try{

        setOrder(
          JSON.parse(savedOrder)
        );

      }
      catch(error){

        console.error(
          "Bill load error",
          error
        );

      }

    }

  },[]);



  // =========================
  // NUMBER FORMAT
  // =========================

  const getNumber = (value)=>{

    const num = Number(

      String(value ?? 0)

      .replace("₹","")

      .replace(/,/g,"")

      .trim()

    );


    return Number.isFinite(num)
      ? num
      : 0;

  };



  const formatPrice = (value)=>{

    return getNumber(value)

    .toLocaleString(
      "en-IN"
    );

  };



  // =========================
  // ITEM DATA
  // =========================


  const getItemName = (item)=>{

    return (

      item?.name ||

      item?.title ||

      "Bird"

    );

  };



  const getItemImage = (item)=>{

    return (

      item?.image ||

      item?.mainImage ||

      ""

    );

  };



  const getItemPrice = (item)=>{

    return getNumber(
      item?.price
    );

  };



  const getQuantity = (item)=>{

    const qty = Number(

      item?.quantity ??

      item?.qty ??

      1

    );


    return qty > 0
      ? qty
      : 1;

  };



  // =========================
  // EMPTY BILL
  // =========================


  if(!order){

    return (

      <section className="bill-page">

        <div className="bill-empty">

          <h2>
            No Bill Found
          </h2>


          <p>
            Please place an order first.
          </p>


          <button
            onClick={()=>navigate("/products")}
          >

            Continue Shopping

          </button>


        </div>

      </section>

    );

  }



  // =========================
  // CUSTOMER DATA
  // =========================


  const customer =
    order.customer || {

      name:
      order.customerName,

      mobile:
      order.phone,

      email:
      order.email,

      address:
      order.address,

      city:
      order.city,

      pincode:
      order.pincode

    };



  const items = Array.isArray(order.items)
    ? order.items
    : [];



  // =========================
  // TOTAL CALCULATION
  // =========================


  const subtotal =

    getNumber(order.subtotal)

    ||

    items.reduce(

      (sum,item)=>{

        return (

          sum +

          getItemPrice(item)

          *

          getQuantity(item)

        );

      },

      0

    );



  const discount =

    getNumber(order.discount);



  const deliveryCharge =

    getNumber(

      order.deliveryCharge ??

      order.shippingCharge

    );



  const total =

    getNumber(order.total)

    ||

    Math.max(

      0,

      subtotal -

      discount +

      deliveryCharge

    );


  return (

    <section className="bill-page">

      <div className="bill-container">


        {/* =========================
            HEADER
        ========================= */}


        <div className="bill-header">


          <div>

            <h1>
              🐦 BIRDS CARE
            </h1>


            <p>
              Birds & Pets Store
            </p>


          </div>



          <div className="invoice-title">

            <h2>
              TAX INVOICE
            </h2>


            <p>
              Original Bill
            </p>


          </div>


        </div>



        <div className="bill-line" />



        {/* =========================
            ORDER DETAILS
        ========================= */}


        <div className="bill-info-grid">


          <div>

            <h3>
              Order Details
            </h3>


            <p>

              <strong>
                Order ID:
              </strong>{" "}

              {order.orderId || "-"}

            </p>



            <p>

              <strong>
                Date:
              </strong>{" "}

              {order.orderDate || "-"}

            </p>



            <p>

              <strong>
                Status:
              </strong>{" "}

              <span className="status">

                {order.status ||

                order.orderStatus ||

                "Confirmed"}

              </span>

            </p>


          </div>




          <div>

            <h3>
              Payment Details
            </h3>



            <p>

              <strong>
                Payment:
              </strong>{" "}

              {order.paymentMethod ||

              "Cash on Delivery"}

            </p>



            <p>

              <strong>
                Payment Status:
              </strong>{" "}

              {order.paymentStatus ||

              "Pending"}

            </p>


          </div>


        </div>




        {/* =========================
            CUSTOMER DETAILS
        ========================= */}



        <div className="customer-box">


          <h3>
            Customer Details
          </h3>



          <div className="customer-grid">


            <div>

              <strong>
                Name
              </strong>

              <p>
                {customer.name || "-"}
              </p>

            </div>




            <div>

              <strong>
                Mobile
              </strong>

              <p>
                {customer.mobile || "-"}
              </p>

            </div>




            <div>

              <strong>
                Email
              </strong>

              <p>
                {customer.email || "-"}
              </p>

            </div>




            <div>

              <strong>
                City
              </strong>

              <p>
                {customer.city || "-"}
              </p>

            </div>




            <div>

              <strong>
                Pincode
              </strong>

              <p>
                {customer.pincode || "-"}
              </p>

            </div>


          </div>



          <div className="address">

            <strong>
              Delivery Address
            </strong>


            <p>
              {customer.address || "-"}
            </p>


          </div>



        </div>





        {/* =========================
            ITEMS TABLE
        ========================= */}



        <div className="items-section">


          <h3>
            Order Items
          </h3>



          <div className="table-wrapper">


            <table>


              <thead>


                <tr>

                  <th>
                    #
                  </th>


                  <th>
                    Product
                  </th>


                  <th>
                    Qty
                  </th>


                  <th>
                    Price
                  </th>


                  <th>
                    Amount
                  </th>


                </tr>


              </thead>




              <tbody>


              {
                items.map(

                  (item,index)=>{


                    const price =
                    getItemPrice(item);


                    const qty =
                    getQuantity(item);


                    const amount =
                    price * qty;



                    return (

                      <tr
                        key={
                          item.id ||
                          index
                        }
                      >


                        <td>
                          {index+1}
                        </td>



                        <td>


                          <div className="bill-item">


                            {
                              getItemImage(item)
                              &&

                              <img

                                src={
                                  getItemImage(item)
                                }

                                alt={
                                  getItemName(item)
                                }

                              />

                            }



                            <span>

                              {
                                getItemName(item)
                              }

                            </span>


                          </div>


                        </td>




                        <td>

                          {qty}

                        </td>




                        <td>

                          ₹
                          {
                            formatPrice(price)
                          }

                        </td>




                        <td>

                          ₹
                          {
                            formatPrice(amount)
                          }

                        </td>



                      </tr>


                    );


                  }

                )

              }


              </tbody>


            </table>


          </div>


        </div>        {/* =========================
            TOTAL SECTION
        ========================= */}


        <div className="bill-bottom">


          <div className="thank-you">


            <h3>
              Thank You! 🐦
            </h3>


            <p>
              Thank you for shopping with Birds Care.
            </p>


            <p>
              We will contact you regarding your order.
            </p>


          </div>




          <div className="totals">


            <div>

              <span>
                Subtotal
              </span>


              <strong>

                ₹
                {
                  formatPrice(
                    subtotal
                  )
                }

              </strong>


            </div>





            <div>

              <span>
                Discount
              </span>


              <strong
                className="discount-text"
              >

                -

                ₹
                {
                  formatPrice(
                    discount
                  )
                }

              </strong>


            </div>





            <div>

              <span>
                Shipping
              </span>


              <strong>

                {
                  deliveryCharge === 0

                  ?

                  "FREE"

                  :

                  `₹${formatPrice(
                    deliveryCharge
                  )}`

                }

              </strong>


            </div>






            <div className="total-row">


              <span>
                Grand Total
              </span>



              <strong>

                ₹
                {
                  formatPrice(
                    total
                  )
                }

              </strong>


            </div>



          </div>


        </div>






        {/* =========================
            BUTTONS
        ========================= */}



        <div className="bill-actions">


          <button

            className="print-btn"

            onClick={()=>window.print()}

          >

            🖨️ Print Bill

          </button>





          <button

            className="shop-btn"

            onClick={()=>navigate("/products")}

          >

            🛍️ Continue Shopping

          </button>



        </div>




      </div>


    </section>

  );

}


export default Bill;