require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: true,
  })
);

// =========================
// JSON
// =========================

app.use(
  express.json({
    limit: "10mb",
  })
);

// =========================
// ENV CHECK
// =========================

console.log(
  "RESEND API KEY:",
  process.env.RESEND_API_KEY
    ? "LOADED"
    : "MISSING"
);

console.log(
  "ORDER EMAIL:",
  process.env.ORDER_EMAIL
    ? process.env.ORDER_EMAIL
    : "MISSING"
);

// =========================
// RESEND
// =========================

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Birds Care server is running",
  });
});

// =========================
// SEND ORDER
// =========================

app.post(
  "/api/send-order",
  async (req, res) => {
    try {
      console.log(
        "\n=============================="
      );

      console.log(
        "NEW ORDER REQUEST"
      );

      console.log(
        "=============================="
      );

      console.log(
        "BODY:",
        JSON.stringify(
          req.body,
          null,
          2
        )
      );

      // =========================
      // ORDER DATA
      // =========================

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

      // =========================
      // CUSTOMER
      // =========================

      const customerData =
        customer || {};

      const customerName =
        customerData.name ||
        req.body.customerName ||
        "";

      const phone =
        customerData.mobile ||
        req.body.phone ||
        "";

      const email =
        customerData.email ||
        req.body.email ||
        "";

      const address =
        customerData.address ||
        req.body.address ||
        "";

      const city =
        customerData.city ||
        req.body.city ||
        "";

      const pincode =
        customerData.pincode ||
        req.body.pincode ||
        "";

      // =========================
      // VALIDATION
      // =========================

      if (!customerName.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer name missing.",
        });
      }

      if (!phone.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number missing.",
        });
      }

      if (!email.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Gmail / Email missing.",
        });
      }

      if (!address.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Address missing.",
        });
      }

      if (!city.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "City missing.",
        });
      }

      if (!pincode.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Pincode missing.",
        });
      }

      // =========================
      // CART VALIDATION
      // =========================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cart is empty.",
        });
      }

      // =========================
      // API KEY
      // =========================

      if (
        !process.env.RESEND_API_KEY
      ) {
        return res.status(500).json({
          success: false,
          message:
            "RESEND_API_KEY missing in .env",
        });
      }

      // =========================
      // ORDER EMAIL
      // =========================

      if (
        !process.env.ORDER_EMAIL
      ) {
        return res.status(500).json({
          success: false,
          message:
            "ORDER_EMAIL missing in .env",
        });
      }

      // =========================
      // PRICE HELPER
      // =========================

      const getPrice = (value) => {
        return (
          Number(
            String(value ?? 0)
              .replace("₹", "")
              .replace(/,/g, "")
              .trim()
          ) || 0
        );
      };

      // =========================
      // ITEMS HTML
      // =========================

      const itemsHtml =
        items
          .map(
            (item, index) => {
              const price =
                getPrice(
                  item.price
                );

              const quantity =
                Number(
                  item.quantity
                ) > 0
                  ? Number(
                      item.quantity
                    )
                  : 1;

              const amount =
                price *
                quantity;

              const name =
                item.name ||
                item.title ||
                item.birdName ||
                "Bird";

              const age =
                item.age || "-";

              const gender =
                item.gender || "-";

              return `
                <tr>

                  <td style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    ${index + 1}
                  </td>

                  <td style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    <strong>
                      ${name}
                    </strong>

                    <br>

                    <small>
                      Age: ${age}
                      <br>
                      Gender: ${gender}
                    </small>
                  </td>

                  <td style="
                    padding:10px;
                    border:1px solid #ddd;
                    text-align:center;
                  ">
                    ${quantity}
                  </td>

                  <td style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    ₹${price.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    ₹${amount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                </tr>
              `;
            }
          )
          .join("");

      // =========================
      // STORE EMAIL HTML
      // =========================

      const storeEmailHtml = `
        <!DOCTYPE html>

        <html>

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

            <h1 style="
              color:#123b35;
              margin-bottom:5px;
            ">
              🐦 BIRDS CARE
            </h1>

            <p>
              Birds & Pets Store
            </p>

            <hr>

            <h2>
              🧾 NEW ORDER RECEIVED
            </h2>

            <h3>
              Order Details
            </h3>

            <p>
              <strong>Order ID:</strong>
              ${orderId || "-"}
            </p>

            <p>
              <strong>Date:</strong>
              ${orderDate || "-"}
            </p>

            <p>
              <strong>Status:</strong>
              ${orderStatus || "Confirmed"}
            </p>

            <p>
              <strong>Payment:</strong>
              ${paymentMethod || "Cash on Delivery"}
            </p>

            <p>
              <strong>Payment Status:</strong>
              ${paymentStatus || "Pending"}
            </p>

            <hr>

            <h3>
              👤 Customer Details
            </h3>

            <p>
              <strong>Name:</strong>
              ${customerName}
            </p>

            <p>
              <strong>Mobile:</strong>
              ${phone}
            </p>

            <p>
              <strong>Gmail:</strong>
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

            <h3>
              🐦 Order Items
            </h3>

            <table style="
              width:100%;
              border-collapse:collapse;
            ">

              <thead>

                <tr>

                  <th style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    #
                  </th>

                  <th style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    Bird
                  </th>

                  <th style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    Qty
                  </th>

                  <th style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
                    Price
                  </th>

                  <th style="
                    padding:10px;
                    border:1px solid #ddd;
                  ">
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
                <strong>
                  Subtotal:
                </strong>

                ₹${Number(
                  subtotal || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <p>
                <strong>
                  Discount:
                </strong>

                <span style="
                  color:#16a34a;
                ">
                  - ₹${Number(
                    discount || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </p>

              <p>
                <strong>
                  Delivery:
                </strong>

                ${
                  Number(
                    deliveryCharge ||
                      0
                  ) === 0
                    ? "FREE"
                    : `₹${Number(
                        deliveryCharge
                      ).toLocaleString(
                        "en-IN"
                      )}`
                }
              </p>

              <hr>

              <h2 style="
                color:#123b35;
              ">
                Grand Total:
                ₹${Number(
                  total || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

            <hr>

            <p>
              🐦 Thank you for using
              Birds Care.
            </p>

          </div>

        </body>

        </html>
      `;

      // =========================
      // SEND STORE EMAIL
      // =========================

      console.log(
        "Sending store email to:",
        process.env.ORDER_EMAIL
      );

      const storeResult =
        await resend.emails.send({
          from:
            process.env.FROM_EMAIL ||
            "Birds Care <onboarding@resend.dev>",

          to: [
            process.env.ORDER_EMAIL,
          ],

          replyTo: email,

          subject:
            `🐦 New Birds Care Order - ${
              orderId || "New Order"
            }`,

          html:
            storeEmailHtml,
        });

      console.log(
        "STORE EMAIL RESULT:",
        storeResult
      );

      // =========================
      // CHECK RESEND ERROR
      // =========================

      if (
        storeResult &&
        storeResult.error
      ) {
        console.error(
          "RESEND ERROR:",
          storeResult.error
        );

        return res.status(500).json({
          success: false,
          message:
            storeResult.error.message ||
            "Resend email failed.",
        });
      }

      // =========================
      // SUCCESS
      // =========================

      return res.status(200).json({
        success: true,

        message:
          "Order placed and email sent successfully.",

        email:
          process.env.ORDER_EMAIL,
      });
    } catch (error) {
      console.error(
        "\nSEND ORDER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to send order email.",
      });
    }
  }
);

// =========================
// START SERVER
// =========================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `🐦 Birds Care server running on http://localhost:${PORT}`
    );
  }
);