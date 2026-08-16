import { useEffect, useState } from "react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const STATUS_OPTIONS = [
    "Order Placed",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrders = () => {
    try {
      setLoading(true);
      setError("");

      const savedOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      if (Array.isArray(savedOrders)) {
        setOrders([...savedOrders].reverse());
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Orders load error:", err);
      setError("Orders load nahi ho paaye.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGE LOAD
  // =========================================================

  useEffect(() => {
    loadOrders();

    const handleStorage = () => {
      loadOrders();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (order) => {
    return (
      order?.orderStatus ||
      order?.status ||
      "Order Placed"
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "Processing":
        return {
          background: "#fef3c7",
          color: "#b45309",
        };

      case "Shipped":
        return {
          background: "#ffedd5",
          color: "#c2410c",
        };

      case "Delivered":
        return {
          background: "#dcfce7",
          color: "#15803d",
        };

      case "Cancelled":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
        };

      default:
        return {
          background: "#f3f4f6",
          color: "#374151",
        };
    }
  };

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  const handleStatusChange = (order, newStatus) => {
    try {
      const savedOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      if (!Array.isArray(savedOrders)) {
        return;
      }

      const targetId =
        order?.orderId ||
        order?.orderNumber ||
        order?.id;

      const updatedOrders = savedOrders.map((savedOrder) => {
        const savedId =
          savedOrder?.orderId ||
          savedOrder?.orderNumber ||
          savedOrder?.id;

        if (String(savedId) === String(targetId)) {
          return {
            ...savedOrder,
            orderStatus: newStatus,
            status: newStatus,
          };
        }

        return savedOrder;
      });

      localStorage.setItem(
        "orders",
        JSON.stringify(updatedOrders)
      );

      setOrders([...updatedOrders].reverse());

      if (selectedOrder) {
        const updatedSelectedOrder =
          updatedOrders.find((savedOrder) => {
            const savedId =
              savedOrder?.orderId ||
              savedOrder?.orderNumber ||
              savedOrder?.id;

            return String(savedId) === String(targetId);
          });

        if (updatedSelectedOrder) {
          setSelectedOrder(updatedSelectedOrder);
        }
      }

      console.log(
        "✅ Order status updated:",
        newStatus
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // =========================================================
  // SAFE DATE FORMAT
  // =========================================================

  const formatDate = (value) => {
    if (!value) {
      return "Date not available";
    }

    if (
      typeof value === "string" &&
      value.trim() === ""
    ) {
      return "Date not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // MONEY
  // =========================================================

  const money = (value) => {
    const number = Number(value || 0);

    return `₹${number.toLocaleString("en-IN")}`;
  };

  // =========================================================
  // ORDER ID
  // =========================================================

  const getOrderId = (order) => {
    return (
      order?.orderId ||
      order?.orderNumber ||
      order?.id ||
      "N/A"
    );
  };

  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const getCustomerName = (order) => {
    return (
      order?.customer?.name ||
      order?.customerName ||
      order?.name ||
      "Customer"
    );
  };

  // =========================================================
  // PHONE
  // =========================================================

  const getPhone = (order) => {
    return (
      order?.customer?.mobile ||
      order?.customer?.phone ||
      order?.phone ||
      order?.mobile ||
      "Not available"
    );
  };

  // =========================================================
  // EMAIL
  // =========================================================

  const getEmail = (order) => {
    return (
      order?.customer?.email ||
      order?.email ||
      "Not available"
    );
  };

  // =========================================================
  // ADDRESS
  // =========================================================

  const getAddress = (order) => {
    const customer = order?.customer || {};

    const address =
      customer.address ||
      order?.address ||
      order?.customerAddress ||
      "";

    const city =
      customer.city ||
      order?.city ||
      "";

    const pincode =
      customer.pincode ||
      order?.pincode ||
      "";

    const parts = [
      address,
      city,
      pincode,
    ].filter(Boolean);

    return (
      parts.join(", ") ||
      "Address not available"
    );
  };

  // =========================================================
  // ITEMS
  // =========================================================

  const getItems = (order) => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.cartItems)) {
      return order.cartItems;
    }

    if (Array.isArray(order?.products)) {
      return order.products;
    }

    return [];
  };

  // =========================================================
  // TOTAL
  // =========================================================

  const getTotal = (order) => {
    const total = Number(
      order?.total ??
        order?.grandTotal ??
        order?.amount ??
        order?.finalTotal ??
        0
    );

    return Number.isFinite(total) ? total : 0;
  };

  // =========================================================
  // ITEM NAME
  // =========================================================

  const getItemName = (item) => {
    return (
      item?.name ||
      item?.birdName ||
      item?.productName ||
      item?.title ||
      "Bird"
    );
  };

  // =========================================================
  // ITEM PRICE
  // =========================================================

  const getItemPrice = (item) => {
    const rawPrice =
      item?.price ??
      item?.sellingPrice ??
      item?.singlePrice ??
      item?.pairPrice ??
      0;

    const price = Number(
      String(rawPrice)
        .replace("₹", "")
        .replace(/,/g, "")
        .trim()
    );

    return Number.isFinite(price) ? price : 0;
  };

  // =========================================================
  // QUANTITY
  // =========================================================

  const getItemQuantity = (item) => {
    const quantity = Number(item?.quantity);

    return quantity > 0 ? quantity : 1;
  };

  // =========================================================
  // PURCHASE TYPE
  // =========================================================

  const getPurchaseType = (item) => {
    return (
      item?.purchaseType ||
      item?.typeOfPurchase ||
      ""
    );
  };

  // =========================================================
  // PAIR DETAILS
  // IMPORTANT:
  // Supports both pairBirds[] AND bird1/bird2 fields
  // =========================================================

  const getPairDetails = (item) => {
    // Old / direct pair array format
    if (
      Array.isArray(item?.pairBirds) &&
      item.pairBirds.length > 0
    ) {
      return item.pairBirds;
    }

    // New Cart format
    const details = [];

    if (
      item?.bird1Age ||
      item?.bird1Gender
    ) {
      details.push({
        birdNumber: 1,
        age: item.bird1Age || "",
        gender: item.bird1Gender || "",
      });
    }

    if (
      item?.bird2Age ||
      item?.bird2Gender
    ) {
      details.push({
        birdNumber: 2,
        age: item.bird2Age || "",
        gender: item.bird2Gender || "",
      });
    }

    return details;
  };

  // =========================================================
  // IS PAIR
  // =========================================================

  const isPairItem = (item) => {
    return (
      getPurchaseType(item).toLowerCase() ===
        "pair" ||
      item?.bird1Age !== undefined ||
      item?.bird1Gender !== undefined ||
      item?.bird2Age !== undefined ||
      item?.bird2Gender !== undefined
    );
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrintBill = () => {
    window.print();
  };

  // =========================================================
  // CLOSE BILL
  // =========================================================

  const closeBill = () => {
    setSelectedOrder(null);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="orders-page">

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <h1>📦 Orders Management</h1>

        <button
          type="button"
          onClick={loadOrders}
          style={{
            padding: "9px 15px",
            borderRadius: "7px",
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "#fff",
            fontWeight: "700",
          }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <div
          style={{
            padding: "25px",
            textAlign: "center",
          }}
        >
          <h3>⏳ Loading Orders...</h3>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            background: "#fee2e2",
            color: "#b91c1c",
            marginBottom: "20px",
          }}
        >
          <h3>❌ {error}</h3>

          <button
            type="button"
            onClick={loadOrders}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #b91c1c",
              background: "#fff",
              color: "#b91c1c",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* NO ORDERS */}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div
            style={{
              padding: "35px 20px",
              textAlign: "center",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "50px" }}>
              📦
            </div>

            <h2>No Orders Found</h2>

            <p>
              Abhi tak koi order nahi mila.
            </p>
          </div>
        )}

      {/* ORDERS */}

      {!loading &&
        !error &&
        orders.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {orders.map((order, index) => {
              const items = getItems(order);
              const total = getTotal(order);

              const orderDate =
                order?.orderDate ||
                order?.created_at ||
                order?.createdAt ||
                order?.date ||
                order?.order_date;

              const currentStatus =
                getStatus(order);

              const statusStyle =
                getStatusStyle(currentStatus);

              return (
                <div
                  key={
                    order?.orderId ||
                    order?.id ||
                    index
                  }
                  className="order-card"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "18px",
                    boxShadow:
                      "0 3px 10px rgba(0,0,0,0.06)",
                  }}
                >

                  {/* ORDER HEADER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0 0 7px",
                        }}
                      >
                        📦 Order #
                        {getOrderId(order)}
                      </h2>

                      <div
                        style={{
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        🕒{" "}
                        {formatDate(orderDate)}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>Status:</strong>

                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order,
                              e.target.value
                            )
                          }
                          style={{
                            padding: "7px 10px",
                            borderRadius: "7px",
                            border:
                              "1px solid #d1d5db",
                            background:
                              statusStyle.background,
                            color:
                              statusStyle.color,
                            fontWeight: "700",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "21px",
                        fontWeight: "800",
                        color: "#15803d",
                      }}
                    >
                      {money(total)}
                    </div>
                  </div>

                  <hr />

                  {/* CUSTOMER */}

                  <div
                    style={{
                      marginBottom: "15px",
                    }}
                  >
                    <h3>
                      👤 Customer Details
                    </h3>

                    <p>
                      <strong>Name:</strong>{" "}
                      {getCustomerName(order)}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {getPhone(order)}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {getEmail(order)}
                    </p>

                    <p>
                      <strong>Address:</strong>{" "}
                      {getAddress(order)}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {order?.paymentMethod ||
                        "Cash on Delivery"}
                    </p>

                    <p>
                      <strong>
                        Payment Status:
                      </strong>{" "}
                      {order?.paymentStatus ||
                        "Pending"}
                    </p>
                  </div>

                  {/* ITEMS */}

                  <div>
                    <h3>🛒 Order Items</h3>

                    {items.length === 0 ? (
                      <p>
                        No item details available.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gap: "10px",
                        }}
                      >
                        {items.map(
                          (item, itemIndex) => {
                            const itemName =
                              getItemName(item);

                            const itemPrice =
                              getItemPrice(item);

                            const quantity =
                              getItemQuantity(item);

                            const purchaseType =
                              getPurchaseType(item);

                            const pairBirds =
                              getPairDetails(item);

                            const pair =
                              isPairItem(item);

                            return (
                              <div
                                key={itemIndex}
                                style={{
                                  padding: "12px",
                                  background:
                                    "#f8fafc",
                                  borderRadius:
                                    "8px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent:
                                      "space-between",
                                    gap: "10px",
                                    flexWrap:
                                      "wrap",
                                  }}
                                >
                                  <div>
                                    <strong>
                                      🐦{" "}
                                      {itemName}
                                    </strong>

                                    <span
                                      style={{
                                        marginLeft:
                                          "8px",
                                        padding:
                                          "3px 7px",
                                        borderRadius:
                                          "5px",
                                        background:
                                          pair
                                            ? "#fff4d6"
                                            : "#dbeafe",
                                        color:
                                          pair
                                            ? "#92400e"
                                            : "#1d4ed8",
                                        fontSize:
                                          "12px",
                                        fontWeight:
                                          "700",
                                      }}
                                    >
                                      {pair
                                        ? "PAIR • 2 BIRDS"
                                        : "SINGLE"}
                                    </span>

                                    <div
                                      style={{
                                        marginTop:
                                          "4px",
                                        fontSize:
                                          "13px",
                                        color:
                                          "#555",
                                      }}
                                    >
                                      Quantity:{" "}
                                      {quantity}
                                    </div>

                                    {!pair &&
                                      item?.age && (
                                        <div
                                          style={{
                                            marginTop:
                                              "3px",
                                            fontSize:
                                              "13px",
                                            color:
                                              "#555",
                                          }}
                                        >
                                          Age:{" "}
                                          {item.age}
                                        </div>
                                      )}

                                    {!pair &&
                                      item?.gender && (
                                        <div
                                          style={{
                                            fontSize:
                                              "13px",
                                            color:
                                              "#555",
                                          }}
                                        >
                                          Gender:{" "}
                                          {item.gender}
                                        </div>
                                      )}
                                  </div>

                                  <strong>
                                    {money(
                                      itemPrice *
                                        quantity
                                    )}
                                  </strong>
                                </div>

                                {/* PAIR DETAILS */}

                                {pair &&
                                  pairBirds.length >
                                    0 && (
                                    <div
                                      style={{
                                        marginTop:
                                          "10px",
                                        padding:
                                          "12px",
                                        background:
                                          "#fff",
                                        border:
                                          "1px solid #e5e7eb",
                                        borderRadius:
                                          "8px",
                                      }}
                                    >
                                      <strong>
                                        🐦🐦 Pair
                                        Details
                                      </strong>

                                      {pairBirds.map(
                                        (
                                          pairBird,
                                          pairIndex
                                        ) => (
                                          <div
                                            key={
                                              pairIndex
                                            }
                                            style={{
                                              marginTop:
                                                "7px",
                                              padding:
                                                "8px",
                                              background:
                                                "#f8fffc",
                                              borderRadius:
                                                "6px",
                                            }}
                                          >
                                            <strong>
                                              Bird{" "}
                                              {pairBird
                                                ?.birdNumber ||
                                                pairIndex +
                                                  1}
                                              :
                                            </strong>{" "}
                                            Age:{" "}
                                            {pairBird
                                              ?.age ||
                                              "Not selected"}{" "}
                                            • Gender:{" "}
                                            {pairBird
                                              ?.gender ||
                                              "Not selected"}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* TOTAL */}

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "12px",
                      background: "#f0fdf4",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    <span>Order Total</span>

                    <span>{money(total)}</span>
                  </div>

                  {/* BILL BUTTON */}

                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      style={{
                        padding: "10px 16px",
                        borderRadius: "7px",
                        border: "none",
                        background: "#16a34a",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      🧾 Generate Bill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* =========================================================
          BILL
      ========================================================= */}

      {selectedOrder && (
        <div
          className="bill-overlay"
          style={{
            position: "fixed",
            inset: "0",
            background:
              "rgba(0,0,0,0.65)",
            zIndex: "9999",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div
            className="bill-popup"
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
            }}
          >

            {/* BILL HEADER */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <h1 style={{ marginBottom: "5px" }}>
                🐦 Birds Care
              </h1>

              <h2>INVOICE / BILL</h2>

              <p>
                Order #:{" "}
                <strong>
                  {getOrderId(selectedOrder)}
                </strong>
              </p>

              <p>
                Date:{" "}
                {formatDate(
                  selectedOrder?.orderDate ||
                    selectedOrder?.created_at ||
                    selectedOrder?.createdAt ||
                    selectedOrder?.date ||
                    selectedOrder?.order_date
                )}
              </p>

              <div
                style={{
                  display: "inline-block",
                  marginTop: "5px",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  fontWeight: "700",
                  ...getStatusStyle(
                    getStatus(selectedOrder)
                  ),
                }}
              >
                Status:{" "}
                {getStatus(selectedOrder)}
              </div>
            </div>

            <hr />

            {/* CUSTOMER */}

            <div style={{ marginTop: "18px" }}>
              <h3>
                Customer Information
              </h3>

              <p>
                <strong>Name:</strong>{" "}
                {getCustomerName(
                  selectedOrder
                )}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {getPhone(selectedOrder)}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {getEmail(selectedOrder)}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {getAddress(selectedOrder)}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {selectedOrder?.paymentMethod ||
                  "Cash on Delivery"}
              </p>

              <p>
                <strong>
                  Payment Status:
                </strong>{" "}
                {selectedOrder?.paymentStatus ||
                  "Pending"}
              </p>
            </div>

            {/* ITEMS */}

            <div style={{ marginTop: "20px" }}>
              <h3>Order Items</h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      Item
                    </th>

                    <th
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Type
                    </th>

                    <th
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "8px",
                      }}
                    >
                      Qty
                    </th>

                    <th
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "8px",
                        textAlign: "right",
                      }}
                    >
                      Price
                    </th>

                    <th
                      style={{
                        border:
                          "1px solid #ddd",
                        padding: "8px",
                        textAlign: "right",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {getItems(
                    selectedOrder
                  ).map((item, index) => {
                    const price =
                      getItemPrice(item);

                    const quantity =
                      getItemQuantity(item);

                    const pair =
                      isPairItem(item);

                    const pairBirds =
                      getPairDetails(item);

                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border:
                              "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          <strong>
                            {getItemName(item)}
                          </strong>

                          {pair &&
                            pairBirds.length >
                              0 && (
                              <div
                                style={{
                                  marginTop: "8px",
                                  fontSize: "12px",
                                  lineHeight: "1.7",
                                }}
                              >
                                <strong>
                                  Pair Details:
                                </strong>

                                {pairBirds.map(
                                  (
                                    bird,
                                    birdIndex
                                  ) => (
                                    <div
                                      key={
                                        birdIndex
                                      }
                                    >
                                      Bird{" "}
                                      {bird
                                        ?.birdNumber ||
                                        birdIndex +
                                          1}
                                      :{" "}
                                      {bird?.age ||
                                        "N/A"}{" "}
                                      •{" "}
                                      {bird
                                        ?.gender ||
                                        "N/A"}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {!pair &&
                            item?.age && (
                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                Age:{" "}
                                {item.age}
                              </div>
                            )}

                          {!pair &&
                            item?.gender && (
                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                }}
                              >
                                Gender:{" "}
                                {item.gender}
                              </div>
                            )}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid #ddd",
                            padding: "8px",
                            textAlign:
                              "center",
                          }}
                        >
                          {pair
                            ? "Pair"
                            : "Single"}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid #ddd",
                            padding: "8px",
                            textAlign:
                              "center",
                          }}
                        >
                          {quantity}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid #ddd",
                            padding: "8px",
                            textAlign:
                              "right",
                          }}
                        >
                          {money(price)}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid #ddd",
                            padding: "8px",
                            textAlign:
                              "right",
                          }}
                        >
                          {money(
                            price * quantity
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TOTAL */}

            <div
              style={{
                marginTop: "20px",
                textAlign: "right",
              }}
            >
              <p>
                Subtotal:{" "}
                <strong>
                  {money(
                    selectedOrder?.subtotal ??
                      getTotal(selectedOrder)
                  )}
                </strong>
              </p>

              <p>
                Discount:{" "}
                <strong>
                  -{" "}
                  {money(
                    selectedOrder?.discount ||
                      0
                  )}
                </strong>
              </p>

              <p>
                Delivery:{" "}
                <strong>
                  {Number(
                    selectedOrder?.deliveryCharge ||
                      0
                  ) === 0
                    ? "FREE"
                    : money(
                        selectedOrder.deliveryCharge
                      )}
                </strong>
              </p>

              <h2>
                Grand Total:{" "}
                {money(
                  getTotal(selectedOrder)
                )}
              </h2>
            </div>

            {/* BUTTONS */}

            <div
              className="bill-actions"
              style={{
                marginTop: "25px",
                display: "flex",
                justifyContent:
                  "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handlePrintBill}
                style={{
                  padding: "10px 20px",
                  borderRadius: "7px",
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                🖨 Print Bill
              </button>

              <button
                type="button"
                onClick={closeBill}
                style={{
                  padding: "10px 20px",
                  borderRadius: "7px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                ✖ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT CSS */}

      <style>
        {`
          @media print {

            body * {
              visibility: hidden !important;
            }

            .bill-overlay,
            .bill-overlay * {
              visibility: visible !important;
            }

            .bill-overlay {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: #fff !important;
              padding: 0 !important;
            }

            .bill-popup {
              max-width: none !important;
              width: 100% !important;
              margin: 0 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            .bill-actions {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}
      </style>
    </div>
  );
}

export default OrdersPage;