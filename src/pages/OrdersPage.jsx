import { useEffect, useState } from "react";


function OrdersPage(){


const [orders,setOrders] = useState([]);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");

const [selectedOrder,setSelectedOrder] = useState(null);
const [updatingStatus,setUpdatingStatus] = useState("");




// ==========================
// LOAD ORDERS
// ==========================

const loadOrders = async()=>{


try{


setLoading(true);

setError("");



const response = await fetch(
"http://localhost:5000/api/orders"
);



const result = await response.json();



console.log(
"ORDERS DATA 👉",
result
);




if(!response.ok){


throw new Error(
result.message ||
"Orders load failed"
);


}




setOrders(

result.orders || []

);



}

catch(err){


console.log(
"Orders Error",
err
);


setError(
err.message
);


}

finally{


setLoading(false);


}



};






useEffect(()=>{


loadOrders();


},[]);






// ==========================
// DATE FIX
// ==========================


const formatDate=(order)=>{


const value =

order?.order_date ||

order?.created_at ||

order?.createdAt ||

order?.date;



if(!value){

return "-";

}




// already formatted date from database

if(

typeof value === "string"

&&

value.includes("/")

){

return value;

}




const d = new Date(value);




if(isNaN(d.getTime())){

return "-";

}



return d.toLocaleString(

"en-IN",

{

day:"2-digit",

month:"2-digit",

year:"numeric",

hour:"2-digit",

minute:"2-digit"

}

);


};








// ==========================
// ITEMS FIX
// ==========================


const getItems=(order)=>{


let items =

order?.items ||

[];




if(typeof items === "string"){


try{

items = JSON.parse(items);

}

catch{

items=[];

}

}




return Array.isArray(items)

?

items

:

[];

};






// ==========================
// TOTAL FIX
// ==========================


const getTotal=(order)=>{


if(order?.total){

return order.total;

}




let total = 0;



getItems(order).forEach(item=>{


total +=

Number(item.price || 0)

*

Number(

item.quantity ||

item.qty ||

1

);



});



return total;


};
const updateStatus = async(orderId,status)=>{


try{


setUpdatingStatus(orderId);



const response = await fetch(

`http://localhost:5000/api/orders/${orderId}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status:status

})

}

);



const result = await response.json();



if(!response.ok){

throw new Error(
result.message ||
"Status update failed"
);

}



alert("✅ Status Updated");


loadOrders();



}

catch(error){


console.log(
"Status Error:",
error
);


alert(
error.message
);


}

finally{


setUpdatingStatus("");

}


};






if(loading){


return(

<div style={{padding:"30px"}}>

<h1>
📦 Orders Management
</h1>


<p>
Loading Orders...
</p>


</div>

);


}






if(error){


return(

<div style={{padding:"30px"}}>

<h1>
📦 Orders Management
</h1>


<p style={{color:"red"}}>

❌ {error}

</p>


<button onClick={loadOrders}>

Retry

</button>


</div>

);


}






return(


<div className="orders-page">


<style>

{`

.orders-page{

padding:20px;

font-family:Arial;

}



.order-card{

background:white;

padding:20px;

margin-top:20px;

border-radius:12px;

box-shadow:0 2px 10px #ddd;

}



.section{

border-top:1px solid #ddd;

margin-top:20px;

padding-top:15px;

}



.btn{

padding:10px 18px;

border:none;

border-radius:8px;

background:#1976d2;

color:white;

cursor:pointer;

}



.invoice-table{

width:100%;

border-collapse:collapse;

}



.invoice-table th,

.invoice-table td{

border:1px solid #ddd;

padding:10px;

}

`}

</style>





<h1>
📦 Orders Management
</h1>




<button

className="btn"

onClick={loadOrders}

>

🔄 Refresh

</button>




<h3>

Total Orders:
{" "}
{orders.length}

</h3>





{

orders.map(

(order)=>(


<div

className="order-card"

key={order.id}

>


<h2>

🧾 {order.order_id}

</h2>



<p>

<b>
Date:
</b>

{" "}

{

formatDate(order)

}

</p>



<p>

<b>
Status:
</b>

{" "}
<div>

<b>
Status:
</b>


<select

value={
order.order_status ||
"Order Placed"
}

onChange={(e)=>{


updateStatus(

order.order_id,

e.target.value

);


}}

disabled={
updatingStatus === order.order_id
}

style={{

marginLeft:"10px",

padding:"8px",

borderRadius:"6px"

}}

>


<option>
Order Placed
</option>


<option>
Confirmed
</option>


<option>
Shipped
</option>


<option>
Delivered
</option>


<option>
Cancelled
</option>


</select>


</div>
{

order.order_status ||

"Order Placed"

}

</p>



<div className="section">

<h3>
👤 Customer Details
</h3>


<p>

<b>Name:</b>

{" "}

{

order.customer_name

}

</p>



<p>

<b>Mobile:</b>

{" "}

{

order.customer_mobile

}

</p>



<p>

<b>Email:</b>

{" "}

{

order.customer_email

}

</p>



<p>

<b>Address:</b>

{" "}

{

order.customer_address

}

</p>


</div><div className="section">


<h3>
🐦 Order Items
</h3>


{

getItems(order).map(

(item,index)=>(


<div key={index}>


<p>

<b>

{
item.name ||
item.title ||
item.product_name ||
"Bird"

}

</b>

</p>



<p>

Quantity:

{" "}

{

item.quantity ||

item.qty ||

1

}

</p>



<p>

Price:

₹

{

item.price ||

0

}

</p>



</div>


)

)


}


</div>







<div className="section">


<h3>
💰 Payment Details
</h3>


<p>

<b>
Payment Method:
</b>

{" "}

{

order.payment_method ||

"Cash on Delivery"

}

</p>



<p>

<b>
Payment Status:
</b>

{" "}

{

order.payment_status ||

"Pending"

}

</p>



</div>







<div className="section">


<h3>
🧾 Order Summary
</h3>



<p>

Subtotal:
₹

{

order.subtotal ||

0

}

</p>



<p>

Discount:
₹

{

order.discount ||

0

}

</p>



<p>

Delivery:
₹

{

order.delivery_charge ||

0

}

</p>




<h2>

Total:

₹

{

getTotal(order)

}

</h2>



</div>







<button

className="btn"

onClick={()=>setSelectedOrder(order)}

>

🧾 Generate Bill

</button>



</div>


)

)


}









{

selectedOrder && (


<div

style={{

position:"fixed",

inset:0,

background:"rgba(0,0,0,0.6)",

padding:"20px",

overflow:"auto",

zIndex:9999

}}

>



<div

style={{

maxWidth:"800px",

margin:"auto",

background:"#fff",

padding:"30px",

borderRadius:"12px"

}}

>




<button

className="btn"

onClick={()=>window.print()}

>

🖨 Print Bill

</button>




<button

style={{

marginLeft:"10px",

padding:"10px 18px",

background:"red",

color:"white",

border:"none",

borderRadius:"8px"

}}

onClick={()=>setSelectedOrder(null)}

>

Close

</button>




<hr/>





<h1 style={{textAlign:"center"}}>

🐦 Birds Care

</h1>




<h2 style={{textAlign:"center"}}>

🧾 Invoice

</h2>




<hr/>




<p>

<b>
Order ID:
</b>

{" "}

{

selectedOrder.order_id

}

</p>




<p>

<b>
Date:
</b>

{" "}

{

formatDate(selectedOrder)

}

</p>




<hr/>





<h3>
👤 Customer Details
</h3>



<p>

Name:
{" "}

{

selectedOrder.customer_name

}

</p>




<p>

Mobile:
{" "}

{

selectedOrder.customer_mobile

}

</p>




<p>

Email:
{" "}

{

selectedOrder.customer_email

}

</p>




<p>

Address:
{" "}

{

selectedOrder.customer_address

}

</p>





<hr/>





<h3>
🐦 Items
</h3>





<table className="invoice-table">


<thead>

<tr>

<th>
Bird
</th>


<th>
Qty
</th>


<th>
Price
</th>


</tr>


</thead>




<tbody>


{

getItems(selectedOrder).map(

(item,index)=>(


<tr key={index}>


<td>

{

item.name ||

item.title ||

item.product_name ||

"Bird"

}

</td>



<td>

{

item.quantity ||

item.qty ||

1

}

</td>



<td>

₹

{

item.price ||

0

}

</td>



</tr>


)


)


}



</tbody>


</table>






<hr/>






<h3>
💰 Payment Summary
</h3>




<p>

Subtotal:
₹

{

selectedOrder.subtotal ||

0

}

</p>



<p>

Discount:
₹

{

selectedOrder.discount ||

0

}

</p>



<p>

Delivery:
₹

{

selectedOrder.delivery_charge ||

0

}

</p>





<h2>

Grand Total:

₹

{

getTotal(selectedOrder)

}

</h2>






<hr/>





<h3 style={{

textAlign:"center"

}}>

Thank you for choosing Birds Care 🐦

</h3>




</div>


</div>


)

}





</div>


);


}



export default OrdersPage;