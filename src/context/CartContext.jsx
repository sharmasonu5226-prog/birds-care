import { createContext, useState } from "react";

export const CartContext = createContext(null);

function CartProvider({ children }) {
  // =====================================================
  // LOAD CART
  // =====================================================

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

      // -------------------------------------------------
      // OLD CART DATA KO CORRECT PAIR/SINGLE ME CONVERT
      // -------------------------------------------------

      return parsed.map((item) => {
        const isPair =
          item.purchaseType === "Pair" ||
          item.purchaseType === "Pair (2 Birds)" ||
          item.itemType === "pair" ||
          String(item.id || "").endsWith("-pair");

        return {
          ...item,

          // IMPORTANT:
          // Pair hamesha "Pair" rahega.
          // Single hamesha "Single" rahega.
          purchaseType: isPair ? "Pair" : "Single",

          quantity:
            Number(item.quantity) > 0
              ? Number(item.quantity)
              : 1,

          // Single options
          age: item.age || "",
          gender: item.gender || "",

          // Pair Bird 1
          bird1Age:
            item.bird1Age ||
            (isPair ? "" : item.age || ""),

          bird1Gender:
            item.bird1Gender ||
            (isPair ? "" : item.gender || ""),

          // Pair Bird 2
          bird2Age:
            item.bird2Age || "",

          bird2Gender:
            item.bird2Gender || "",
        };
      });
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  // =====================================================
  // SAVE CART
  // =====================================================

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (bird, options = {}) => {
    // -------------------------------------------------
    // STOCK CHECK
    // -------------------------------------------------

    if (
      bird.stock === "Out of Stock" ||
      bird.stock === false ||
      bird.inStock === false
    ) {
      alert("This bird is Out of Stock ❌");
      return;
    }

    // -------------------------------------------------
    // VERY IMPORTANT PAIR DETECTION
    //
    // FeaturedBirds se:
    // purchaseType = "Pair (2 Birds)"
    // itemType = "pair"
    //
    // Isliye dono ko check karna zaroori hai.
    // -------------------------------------------------

    const isPair =
      bird.purchaseType === "Pair" ||
      bird.purchaseType === "Pair (2 Birds)" ||
      bird.itemType === "pair" ||
      String(bird.id || "").endsWith("-pair");

    const purchaseType =
      isPair ? "Pair" : "Single";

    // -------------------------------------------------
    // CART ID
    //
    // Pair aur Single alag item rahenge.
    // -------------------------------------------------

    const cartId =
      isPair
        ? (
            String(bird.id || "").endsWith("-pair")
              ? bird.id
              : `${bird.id}-pair`
          )
        : bird.id;

    // -------------------------------------------------
    // CHECK DUPLICATE
    // -------------------------------------------------

    const alreadyExist = cart.find(
      (item) =>
        item.id === cartId &&
        item.purchaseType === purchaseType
    );

    if (alreadyExist) {
      alert(
        `This ${purchaseType.toLowerCase()} is already in cart 🛒`
      );
      return;
    }

    // =================================================
    // CREATE CART ITEM
    // =================================================

    const cartItem = {
      ...bird,

      // Correct ID
      id: cartId,

      // Correct purchase type
      purchaseType,

      // Correct item type
      itemType: isPair ? "pair" : "single",

      quantity:
        Number(options.quantity) > 0
          ? Number(options.quantity)
          : 1,

      // =================================================
      // SINGLE OPTIONS
      // =================================================

      age: isPair
        ? ""
        : options.age || "",

      gender: isPair
        ? ""
        : options.gender || "",

      // =================================================
      // PAIR BIRD 1 OPTIONS
      // =================================================

      bird1Age: isPair
        ? options.bird1Age || ""
        : "",

      bird1Gender: isPair
        ? options.bird1Gender || ""
        : "",

      // =================================================
      // PAIR BIRD 2 OPTIONS
      // =================================================

      bird2Age: isPair
        ? options.bird2Age || ""
        : "",

      bird2Gender: isPair
        ? options.bird2Gender || ""
        : "",
    };

    // -------------------------------------------------
    // ADD
    // -------------------------------------------------

    const updated = [
      ...cart,
      cartItem,
    ];

    saveCart(updated);

    // -------------------------------------------------
    // SUCCESS MESSAGE
    // -------------------------------------------------

    alert(
      isPair
        ? "Pair (2 Birds) added to cart 🐦🐦🛒"
        : "Single added to cart 🐦🛒"
    );
  };

  // =====================================================
  // UPDATE SINGLE OPTIONS
  // =====================================================

  const updateItemOptions = (
    id,
    age,
    gender
  ) => {
    const updated = cart.map((item) => {
      if (
        item.id === id &&
        item.purchaseType !== "Pair"
      ) {
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
    });

    saveCart(updated);
  };

  // =====================================================
  // UPDATE PAIR OPTIONS
  // =====================================================

  const updatePairOptions = (
    id,
    birdNumber,
    age,
    gender
  ) => {
    const updated = cart.map((item) => {
      // -------------------------------------------------
      // ONLY PAIR ITEM
      // -------------------------------------------------

      if (
        item.id !== id ||
        item.purchaseType !== "Pair"
      ) {
        return item;
      }

      // =================================================
      // BIRD 1
      // =================================================

      if (birdNumber === 1) {
        return {
          ...item,

          bird1Age:
            age !== undefined
              ? age
              : item.bird1Age,

          bird1Gender:
            gender !== undefined
              ? gender
              : item.bird1Gender,
        };
      }

      // =================================================
      // BIRD 2
      // =================================================

      if (birdNumber === 2) {
        return {
          ...item,

          bird2Age:
            age !== undefined
              ? age
              : item.bird2Age,

          bird2Gender:
            gender !== undefined
              ? gender
              : item.bird2Gender,
        };
      }

      return item;
    });

    saveCart(updated);
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

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

    const updated = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity,
        };
      }

      return item;
    });

    saveCart(updated);
  };

  // =====================================================
  // REMOVE
  // =====================================================

  const removeFromCart = (id) => {
    const updated = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updated);
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartTotal = cart.reduce(
    (total, item) => {
      const price =
        Number(
          String(item.price || 0)
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

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        updateItemOptions,

        updatePairOptions,

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

export default CartProvider;