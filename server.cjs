require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

console.log("");
console.log("================================");
console.log("🐦 BIRDS CARE SERVER");
console.log("================================");

console.log(
  "RESEND API KEY:",
  process.env.RESEND_API_KEY ? "LOADED" : "MISSING"
);

console.log(
  "ORDER EMAIL:",
  process.env.ORDER_EMAIL || "MISSING"
);

console.log(
  "FROM EMAIL:",
  process.env.FROM_EMAIL || "Using default Resend email"
);

const resend = new Resend(
  process.env.RESEND_API_KEY
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Birds Care server is running",
  });
});

app.post("/api/send-order", async (req, res) => {
  try {
    console.log("");
    console.log("================================");
    console.log("📦 NEW ORDER");
    console.log("================================");

    console.log(
      "BODY:",
      JSON.stringify(req.body, null, 2)
    );
console.log("ORDER RECEIVED SUCCESSFULLY");
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
      total,
    } = req.body;

    const customerData = customer || {};

    const customerName = String(
      customerData.name ||
      req.body.customerName ||
      ""
    ).trim();

    const phone = String(
      customerData.mobile ||
      req.body.phone ||
      ""
    ).trim();

    const email = String(
      customerData.email ||
      req.body.email ||
      ""
    ).trim();

    const address = String(
      customerData.address ||
      req.body.address ||
      ""
    ).trim();

    const city = String(
      customerData.city ||
      req.body.city ||
      ""
    ).trim();

    const pincode = String(
      customerData.pincode ||
      req.body.pincode ||
      ""
    ).trim();

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name missing.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Mobile number missing.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email missing.",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address missing.",
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City missing.",
      });
    }

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode missing.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "RESEND_API_KEY missing in .env",
      });
    }

    if (!process.env.ORDER_EMAIL) {
      return res.status(500).json({
        success: false,
        message: "ORDER_EMAIL missing in .env",
      });
    }

    function getPrice(value) {
      const number = Number(
        String(value ?? 0)
          .replace("₹", "")
          .replace(/,/g, "")
          .trim()
      );

      return Number.isFinite(number)
        ? number
        : 0;
    }

    const itemsHtml = items
      .map((item, index) => {
        const name =
          item.name ||
          item.title ||
          item.birdName ||
          "Bird";

        const age = item.age || "-";

        const gender = item.gender || "-";

        const price = getPrice(item.price);

        const quantity =
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1;

        const amount =
          price * quantity;

        return `
<tr>
  <td style="padding:12px;border:1px solid #ddd;text-align:center;">
    ${index + 1}
  </td>

  <td style="padding:12px;border:1px solid #ddd;">
    <strong>${name}</strong>
    <br>
    <small>
      Age: ${age}
      <br>
      Gender: ${gender}
    </small>
  </td>

  <td style="padding:12px;border:1px solid #ddd;text-align:center;">
    ${quantity}
  </td>

  <td style="padding:12px;border:1px solid #ddd;">
    ₹${price.toLocaleString("en-IN")}
  </td>

  <td style="padding:12px;border:1px solid #ddd;">
    ₹${amount.toLocaleString("en-IN")}
  </td>
</tr>
`;
      })
      .join("");

    const billHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Birds Care Order Bill</title>
</head>

<body style="
margin:0;
padding:20px;
background:#f5f7f6;
font-family:Arial,sans-serif;
color:#222;
">

<div style="
max-width:800px;
margin:auto;
background:white;
padding:30px;
border-radius:12px;
">

<h1 style="color:#123b35;">
🐦 BIRDS CARE
</h1>

<p>Birds & Pets Store</p>

<hr>

<h2>🧾 ORDER BILL</h2>

<p>
<strong>Order ID:</strong>
${orderId || "-"}
</p>

<p>
<strong>Order Date:</strong>
${orderDate || "-"}
</p>

<p>
<strong>Order Status:</strong>
${orderStatus || "Confirmed"}
</p>

<p>
<strong>Payment Method:</strong>
${paymentMethod || "Cash on Delivery"}
</p>

<p>
<strong>Payment Status:</strong>
${paymentStatus || "Pending"}
</p>

<hr>

<h3>👤 Customer Details</h3>

<p>
<strong>Name:</strong>
${customerName}
</p>

<p>
<strong>Mobile:</strong>
${phone}
</p>

<p>
<strong>Email:</strong>
${email}
</p>

<p>
<strong>Address:</strong>
${address}
</p>

<p>
<strong>City:</strong>
${city}
</p>

<p>
<strong>Pincode:</strong>
${pincode}
</p>

<hr>

<h3>🐦 Ordered Birds</h3>

<table style="
width:100%;
border-collapse:collapse;
">

<thead>
<tr>

<th style="padding:12px;border:1px solid #ddd;">
#
</th>

<th style="padding:12px;border:1px solid #ddd;">
Bird
</th>

<th style="padding:12px;border:1px solid #ddd;">
Qty
</th>

<th style="padding:12px;border:1px solid #ddd;">
Price
</th>

<th style="padding:12px;border:1px solid #ddd;">
Amount
</th>

</tr>
</thead>

<tbody>

${itemsHtml}

</tbody>

</table>
<div style="
margin-top:25px;
padding:20px;
background:#f0fdf4;
border-radius:10px;
">

<p>
<strong>Subtotal:</strong>
₹${getPrice(subtotal).toLocaleString("en-IN")}
</p>

<p>
<strong>Discount:</strong>
- ₹${getPrice(discount).toLocaleString("en-IN")}
</p>

<p>
<strong>Delivery:</strong>
${
  getPrice(deliveryCharge) === 0
    ? "FREE"
    : `₹${getPrice(deliveryCharge).toLocaleString("en-IN")}`
}
</p>

<hr>

<h2 style="color:#123b35;">
Grand Total:
₹${getPrice(total).toLocaleString("en-IN")}
</h2>

</div>

<hr>

<h3>
✅ Thank you for ordering from Birds Care!
</h3>

<p>
Your order has been successfully received.
</p>

</div>

</body>

</html>
`;

    const fromEmail =
      process.env.FROM_EMAIL ||
      "Birds Care <onboarding@resend.dev>";

    console.log(
      "📧 Sending STORE email to:",
      process.env.ORDER_EMAIL
    );

    const storeResult =
      await resend.emails.send({
        from: fromEmail,

        to: [
          process.env.ORDER_EMAIL
        ],

        replyTo: email,

        subject:
          `🐦 New Birds Care Order - ${
            orderId || "New Order"
          }`,

        html: billHtml,
      });

    console.log(
      "STORE EMAIL RESULT:",
      storeResult
    );

    if (
      storeResult &&
      storeResult.error
    ) {
      console.error(
        "STORE EMAIL ERROR:",
        storeResult.error
      );

      return res.status(500).json({
        success: false,
        message:
          storeResult.error.message ||
          "Store email failed.",
      });
    }

    let customerEmailSent = false;

    let customerEmailError = null;

    try {

      console.log(
        "📧 Sending CUSTOMER email to:",
        email
      );

      const customerResult =
        await resend.emails.send({
          from: fromEmail,

          to: [
            email
          ],

          replyTo:
            process.env.ORDER_EMAIL,

          subject:
            `🐦 Birds Care - Your Order Bill ${
              orderId || ""
            }`,

          html: billHtml,
        });

      console.log(
        "CUSTOMER EMAIL RESULT:",
        customerResult
      );

      if (
        customerResult &&
        customerResult.error
      ) {

        customerEmailError =
          customerResult.error.message ||
          "Customer email failed.";

        console.error(
          "CUSTOMER EMAIL ERROR:",
          customerEmailError
        );

      } else {

        customerEmailSent = true;

        console.log(
          "✅ CUSTOMER EMAIL SENT"
        );
      }

    } catch (customerError) {

      console.error(
        "CUSTOMER EMAIL ERROR:",
        customerError
      );

      customerEmailError =
        customerError.message ||
        "Customer email failed.";
    }

    console.log("");
    console.log(
      "================================"
    );

    console.log(
      "✅ ORDER COMPLETED"
    );

    console.log(
      "================================"
    );

    return res.status(200).json({

      success: true,

      message:
        "Order placed successfully.",

      storeEmailSent:
        true,

      customerEmailSent:
        customerEmailSent,

      customerEmail:
        email,

      customerEmailError:
        customerEmailError,

      orderId:
        orderId || null,
    });

  } catch (error) {

    console.error("");

    console.error(
      "================================"
    );

    console.error(
      "❌ SEND ORDER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================"
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to send order email.",
    });
  }
});

// ========================================
// START SERVER
// ========================================

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");

    console.log(
      "================================"
    );

    console.log(
      "🐦 Birds Care server running"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "================================"
    );

    console.log(
      "✅ SERVER READY"
    );
  }
);

server.on(
  "error",
  (error) => {

    console.error("");

    console.error(
      "❌ SERVER ERROR:"
    );

    console.error(
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {

    console.error("");

    console.error(
      "❌ UNCAUGHT EXCEPTION:"
    );

    console.error(
      error
    );
  }
);

process.on(
  "unhandledRejection",
  (error) => {

    console.error("");

    console.error(
      "❌ UNHANDLED REJECTION:"
    );

    console.error(
      error
    );
  }
);