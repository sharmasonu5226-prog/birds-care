import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";


dotenv.config();


const app = express();


app.use(cors());


app.use(
  express.json({
    limit:"10mb"
  })
);



// ================================
// ENV
// ================================

const supabaseUrl =
process.env.VITE_SUPABASE_URL;


const supabaseServiceKey =
process.env.SUPABASE_SERVICE_ROLE_KEY;


const resendApiKey =
process.env.RESEND_API_KEY;


const orderEmail =
process.env.ORDER_EMAIL;


const fromEmail =
process.env.FROM_EMAIL ||
"Birds Care <onboarding@resend.dev>";



// ================================
// SUPABASE
// ================================


const supabase =
createClient(
  supabaseUrl,
  supabaseServiceKey
);



// ================================
// RESEND
// ================================


const resend =
new Resend(
  resendApiKey
);



// ================================
// SERVER CHECK
// ================================


console.log("");

console.log("===============================");
console.log("🐦 BIRDS CARE SERVER");
console.log("===============================");


console.log(
"SUPABASE URL:",
supabaseUrl ? "LOADED":"MISSING"
);


console.log(
"SUPABASE SERVICE KEY:",
supabaseServiceKey ? "LOADED":"MISSING"
);


console.log(
"RESEND API KEY:",
resendApiKey ? "LOADED":"MISSING"
);


console.log(
"ORDER EMAIL:",
orderEmail
);


console.log(
"FROM EMAIL:",
fromEmail
);



// ================================
// HOME
// ================================


app.get(
"/",
(req,res)=>{

res.json({

success:true,

message:
"Birds Care Server Running 🐦"

});

}
);



// ================================
// GET ORDERS
// ================================


app.get(
"/api/orders",

async(req,res)=>{


try{


const {

data,

error

}

=
await supabase

.from("orders")

.select("*")

.order(
"created_at",
{
ascending:false
}
);



if(error){

return res.status(500)
.json({

success:false,

message:
error.message

});

}



res.json({

success:true,

orders:
data || []

});



}

catch(error){


res.status(500)
.json({

success:false,

message:
error.message

});


}


}

);// ==================================================
// UPDATE ORDER STATUS
// ==================================================


app.put(
"/api/orders/:orderId",

async(req,res)=>{


try{


const orderId =
req.params.orderId;


const status =
req.body.status;



console.log(
"🔄 STATUS UPDATE:",
orderId,
status
);



if(!orderId || !status){


return res.status(400)
.json({

success:false,

message:
"Order id or status missing"

});

}




const {

data,

error

}

=
await supabase

.from("orders")

.update({

order_status:
status

})

.eq(
"order_id",
orderId
)

.select();





if(error){


console.log(
"STATUS UPDATE ERROR:",
error
);



return res.status(500)
.json({

success:false,

message:
"Status update failed",

error:
error.message

});


}





res.json({

success:true,

message:
"Order status updated",

order:
data?.[0] || null

});



}

catch(error){


console.log(
error
);


res.status(500)
.json({

success:false,

message:
error.message

});


}


}

);




// ==================================================
// SAVE ORDER + SEND EMAIL
// ==================================================


app.post(
"/api/send-order",

async(req,res)=>{


try{


console.log(
"📦 NEW ORDER"
);



const body =
req.body;

const customerFixed = {

name:
body.customerName || "",

mobile:
body.phone || "",

email:
body.email || "",

address:
body.address || "",

city:
body.city || "",

pincode:
body.pincode || ""

};

console.log(
JSON.stringify(
body,
null,
2
)
);





const {

orderId,

orderDate,

orderStatus,

paymentMethod,

paymentStatus,

customer,

items,

subtotal,

discount,

deliveryCharge,

total

}

=
body;





if(!orderId){


return res.status(400)
.json({

success:false,

message:
"Order ID missing"

});


}




const customerData = customerFixed;






if(

!customerData.name ||

!customerData.mobile ||

!customerData.email ||

!customerData.address ||

!customerData.city ||

!customerData.pincode

){


return res.status(400)
.json({

success:false,

message:
"Customer details missing",

customer:
customerData

});


}





// ==================================================
// INSERT ORDER
// ==================================================


const {

data,

error

}

=
await supabase

.from("orders")

.insert([{


order_id:
orderId,


order_date:
orderDate ||
new Date()
.toISOString(),


order_status:
orderStatus ||
"Order Placed",


payment_method:
paymentMethod ||
"Cash on Delivery",


payment_status:
paymentStatus ||
"Pending",



customer_name:
customerData.name,


customer_mobile:
customerData.mobile,


customer_email:
customerData.email,


customer_address:
customerData.address,


customer_city:
customerData.city,


customer_pincode:
customerData.pincode,



items:
Array.isArray(items)
?
items
:
[],



subtotal:
Number(subtotal)||0,


discount:
Number(discount)||0,


delivery_charge:
Number(deliveryCharge)||0,


total:
Number(total)||0


}])

.select();





if(error){


console.log(
"ORDER SAVE ERROR",
error
);



return res.status(500)
.json({

success:false,

message:
error.message

});


}





console.log(
"✅ ORDER SAVED"
);


// ==================================================
// CREATE BILL HTML
// ==================================================


const billHtml = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Birds Care Bill
</title>

</head>


<body

style="
font-family:Arial;
background:#f5f5f5;
padding:20px;
"

>


<div

style="
max-width:800px;
margin:auto;
background:white;
padding:30px;
border-radius:10px;
"

>


<h1>
🐦 Birds Care
</h1>


<p>
Bird Selling & Care
</p>


<hr>



<h2>
🧾 Order Invoice
</h2>



<p>

<b>
Order ID:
</b>

${orderId}

</p>



<p>

<b>
Date:
</b>

${
orderDate ||
new Date().toLocaleString("en-IN")
}

</p>



<p>

<b>
Status:
</b>

${
orderStatus ||
"Order Placed"
}

</p>



<hr>



<h3>
👤 Customer Details
</h3>


<p>
<b>Name:</b>
${customerData.name}
</p>


<p>
<b>Mobile:</b>
${customerData.mobile}
</p>


<p>
<b>Email:</b>
${customerData.email}
</p>


<p>
<b>Address:</b>
${customerData.address}
</p>


<p>
<b>City:</b>
${customerData.city}
</p>


<p>
<b>Pincode:</b>
${customerData.pincode}
</p>




<hr>



<h3>
🐦 Order Items
</h3>



<table

style="
width:100%;
border-collapse:collapse;
"

>


<tr>

<th
style="
border:1px solid #ddd;
padding:10px;
"
>
Bird
</th>


<th
style="
border:1px solid #ddd;
padding:10px;
"
>
Qty
</th>


<th
style="
border:1px solid #ddd;
padding:10px;
"
>
Price
</th>


</tr>



${
Array.isArray(items)

?

items.map(item=>{


return `


<tr>


<td
style="
border:1px solid #ddd;
padding:10px;
"
>

${
item.name ||
item.title ||
"Bird"
}

</td>



<td
style="
border:1px solid #ddd;
padding:10px;
"
>

${
item.quantity ||
item.qty ||
1
}

</td>



<td
style="
border:1px solid #ddd;
padding:10px;
"
>

₹

${
Number(
item.price ||
0
)

}

</td>



</tr>


`


}).join("")

:

""

}



</table>




<hr>



<h3>
💰 Payment Summary
</h3>



<p>

Subtotal:
₹${Number(subtotal)||0}

</p>



<p>

Discount:
₹${Number(discount)||0}

</p>



<p>

Delivery:
₹${Number(deliveryCharge)||0}

</p>



<h2>

Grand Total:

₹${Number(total)||0}

</h2>




<hr>



<h3>

Thank you for choosing Birds Care 🐦

</h3>



</div>


</body>

</html>

`;





// ==================================================
// SEND EMAIL
// ==================================================


let emailSent = false;



try{


if(
resend &&
orderEmail
){



await resend.emails.send({

from:
fromEmail,


to:[
orderEmail
],


subject:

`🐦 New Birds Care Order - ${orderId}`,


html:
billHtml


});



console.log(
"✅ Admin email sent"
);



emailSent = true;



if(customerData.email){


await resend.emails.send({

from:
fromEmail,


to:[
customerData.email
],


subject:

`🐦 Birds Care Order Bill - ${orderId}`,


html:
billHtml


});



console.log(
"✅ Customer email sent"
);


}



}



}

catch(emailError){


console.log(
"EMAIL ERROR:",
emailError
);


}





// ==================================================
// FINAL RESPONSE
// ==================================================


return res.json({

success:true,

message:
"Order saved successfully",


emailSent:


emailSent,


order:
data?.[0] || null


});



}


catch(error){


console.log(
"ORDER ERROR:",
error
);



return res.status(500)
.json({

success:false,

message:
error.message

});


}



}

);// ==================================================
// SERVER START
// ==================================================


const PORT =
process.env.PORT || 5000;



app.listen(

PORT,

()=>{


console.log("");

console.log("===============================");

console.log(
`🐦 Birds Care Server running on http://localhost:${PORT}`
);

console.log("===============================");

console.log("");


}

);