import { createContext, useState } from "react";


// =========================
// CART CONTEXT
// =========================

export const CartContext = createContext(null);


// =========================
// CART PROVIDER
// =========================

function CartProvider({ children }) {

  // =========================
  // LOAD CART FROM LOCAL STORAGE
  // =========================

  const [cart, setCart] = useState(() => {

    const saved = localStorage.getItem("cart");

    if (!saved) {
      return [];
    }

    try {

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((item) => ({

        ...item,

        quantity:
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1,

        age: item.age || "",

        gender: item.gender || "",

      }));

    } catch (error) {

      console.error(
        "Cart loading error:",
        error
      );

      return [];
    }

  });


  // =========================
  // SAVE CART
  // =========================

  const saveCart = (updatedCart) => {

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (bird) => {

    if (
      bird.stock === "Out of Stock" ||
      bird.stock === false ||
      bird.inStock === false
    ) {

      alert(
        "This bird is Out of Stock ❌"
      );

      return;
    }


    // Check already exists

    const alreadyExist = cart.find(
      (item) =>
        item.id === bird.id
    );


    if (alreadyExist) {

      alert(
        "This bird is already in cart 🛒"
      );

      return;
    }


    // Create cart item

    const cartItem = {

      ...bird,

      age: "",

      gender: "",

      quantity: 1,

    };


    const updated = [
      ...cart,
      cartItem,
    ];


    saveCart(updated);


    alert(
      "Bird added to cart 🛒"
    );

  };


  // =========================
  // UPDATE AGE / GENDER
  // =========================

  const updateItemOptions = (
    id,
    age,
    gender
  ) => {

    const updated = cart.map(
      (item) => {

        if (item.id === id) {

          return {

            ...item,

            age:
              age !== undefined
                ? age
                : item.age,

            gender:
              gender !== undefined
                ? gender
                : item.gender,

          };

        }

        return item;

      }
    );


    saveCart(updated);

  };


  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (
    id,
    newQuantity
  ) => {

    const quantity =
      Number(newQuantity);


    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {

      removeFromCart(id);

      return;
    }


    const updated = cart.map(
      (item) => {

        if (item.id === id) {

          return {

            ...item,

            quantity,

          };

        }

        return item;

      }
    );


    saveCart(updated);

  };


  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (id) => {

    const updated = cart.filter(
      (item) =>
        item.id !== id
    );


    saveCart(updated);

  };


  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem(
      "cart"
    );

  };


  // =========================
  // CART TOTAL
  // =========================

  const cartTotal = cart.reduce(
    (total, item) => {

      const price =
        Number(
          String(
            item.price || 0
          )
            .replace("₹", "")
            .replace(/,/g, "")
            .trim()
        ) || 0;


      const quantity =
        Number(item.quantity) > 0
          ? Number(item.quantity)
          : 1;


      return (
        total +
        price * quantity
      );

    },
    0
  );


  // =========================
  // PROVIDER
  // =========================

  return (

    <CartContext.Provider
      value={{

        cart,

        addToCart,

        updateItemOptions,

        updateQuantity,

        removeFromCart,

        clearCart,

        cartTotal,

      }}
    >

      {children}

    </CartContext.Provider>

  );

}


// =========================
// DEFAULT EXPORT
// =========================

export default CartProvider;