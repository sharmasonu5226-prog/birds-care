import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bill(){

const navigate = useNavigate();

const [order,setOrder] = useState(null);


useEffect(()=>{

const saved = localStorage.getItem("birdsCareLastOrder");

if(saved){

try{

setOrder(JSON.parse(saved));

}catch(error){

console.log(error);

}

}

},[]);



const number=(value)=>{

let n = Number(
String(value ?? 0)
.replace("₹","")
.replace(/,/g,"")
.trim()
);

return isNaN(n)?0:n;

};



const price=(value)=>{

return number(value).toLocaleString("en-IN");

};



const itemName=(item)=>{

return item?.name ||
item?.title ||
"Bird";

};



const itemImage=(item)=>{

return item?.image ||
item?.mainImage ||
"";

};



const itemPrice=(item)=>{

return number(item?.price);

};



const quantity=(item)=>{

let q = Number(
item?.quantity ??
item?.qty ??
1
);

return q>0?q:1;

};



if(!order){

return(

<div className="bill-page">

<div className="bill-container">

<h2>No Bill Found</h2>

<button onClick={()=>navigate("/products")}>

Continue Shopping

</button>

</div>

</div>

);

}



const customer = order.customer || {

name:order.customerName,
mobile:order.phone,
email:order.email,
address:order.address,
city:order.city,
pincode:order.pincode

};



const items = Array.isArray(order.items)
?
order.items
:
[];



const subtotal =

number(order.subtotal) ||

items.reduce(
(total,item)=>
total + itemPrice(item)*quantity(item)
,0);



const discount = number(order.discount);



const delivery = number(
order.deliveryCharge ??
order.shippingCharge
);



const grandTotal =

number(order.total) ||

subtotal-discount+delivery;



return(

<section className="bill-page">


<div className="bill-container">



{/* HEADER */}

<div className="new-bill-header">


<div className="bill-logo">

<img 
src="/birds-care-logo.png"
alt="Birds Care"
/>

</div>



<div className="invoice-title">

<h1>TAX INVOICE</h1>

<p>Original Bill</p>

</div>


</div>



<div className="address-line">

Kalamma Rd Near Life Line Hospital Kamptee, Yerkheda

</div>



{/* INFO BOX */}


<div className="bill-box-grid">


<div className="bill-box">

<h3>Order Details</h3>

<p>
<b>Order ID :</b> {order.orderId || "-"}
</p>

<p>
<b>Date :</b> {order.orderDate || "-"}
</p>

<p>
<b>Status :</b> {order.status || "Confirmed"}
</p>

</div>



<div className="bill-box">

<h3>Payment Details</h3>

<p>
<b>Payment Method :</b>
{order.paymentMethod || "Cash on Delivery"}
</p>


<p>
<b>Payment Status :</b>
{order.paymentStatus || "Pending"}
</p>


</div>



<div className="bill-box">

<h3>Customer Details</h3>

<p>
<b>Name :</b> {customer.name || "-"}
</p>

<p>
<b>Mobile :</b> {customer.mobile || "-"}
</p>

<p>
<b>Email :</b> {customer.email || "-"}
</p>

<p>
<b>Address :</b> {customer.address || "-"}
</p>

<p>
<b>City :</b> {customer.city || "-"}
</p>

<p>
<b>Pincode :</b> {customer.pincode || "-"}
</p>


</div>


</div>{/* ORDER ITEMS */}

<div className="items-section">

<h3>Order Items</h3>


<table className="bill-table">


<thead>

<tr>

<th>#</th>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
<th>Amount</th>

</tr>

</thead>



<tbody>


{

items.map((item,index)=>(


<tr key={index}>


<td>
{index+1}
</td>



<td>


<div className="product-row">


{
itemImage(item) &&

<img

src={itemImage(item)}

alt={itemName(item)}

className="bill-product-image"

/>

}



<div>


<b>
{itemName(item)}
</b>


<p>

Age: {item.age || "Adult"}

&nbsp; | &nbsp;

Gender: {item.gender || "Pair"}

</p>


</div>


</div>


</td>



<td>

{quantity(item)}

</td>



<td>

₹{price(itemPrice(item))}

</td>



<td>

₹{price(itemPrice(item)*quantity(item))}

</td>



</tr>


))


}


</tbody>


</table>


</div>





{/* TOTAL */}



<div className="bill-total-box">


<div>

<span>
Subtotal
</span>

<b>
₹{price(subtotal)}
</b>


</div>



<div>

<span>
Discount
</span>


<b>
- ₹{price(discount)}
</b>


</div>



<div>

<span>
Shipping Charge
</span>


<b>

{
delivery===0
?
"FREE"
:
`₹${price(delivery)}`
}


</b>


</div>




<div className="grand-total">


<span>
Grand Total
</span>


<b>

₹{price(grandTotal)}

</b>


</div>



</div>





{/* BUTTONS */}


<div className="bill-actions">


<button

className="print-btn"

onClick={()=>window.print()}

>

🖨 Print Bill

</button>



<button

className="shop-btn"

onClick={()=>navigate("/products")}

>

🛒 Continue Shopping

</button>


</div>





{/* FOOTER */}


<div className="bill-footer">


<p>

Thank you for shopping with Birds Care.

</p>


<p>

We will contact you regarding your order.

</p>


</div>



</div>


</section>


);


}


export default Bill;