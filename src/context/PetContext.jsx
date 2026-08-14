import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const PetContext = createContext(null);

function PetProvider({ children }) {
  // ==================================================
  // DEFAULT PRODUCTS
  // ==================================================

  const defaultPets = [
    {
      name: "African Grey",
      price: 15000,
      type: "Parrot",
      image: null,
      emoji: "🐦",
      stock: "In Stock",
      description:
        "African Grey is one of the smartest parrots and a very friendly bird.",
    },
    {
      name: "Love Bird",
      price: 2500,
      type: "Love Bird",
      image: null,
      emoji: "🐥",
      stock: "In Stock",
      description:
        "Love Birds are colorful, social and perfect for beginners.",
    },
    {
      name: "Cockatiel",
      price: 6000,
      type: "Cockatiel",
      image: null,
      emoji: "🕊️",
      stock: "In Stock",
      description:
        "Cockatiels are calm, playful and easy to train.",
    },
    {
      name: "Macaw",
      price: 45000,
      type: "Parrot",
      image: null,
      emoji: "🦜",
      stock: "In Stock",
      description:
        "Macaws are beautiful large parrots with colorful feathers.",
    },
    {
      name: "Budgie",
      price: 1800,
      type: "Budgie",
      image: null,
      emoji: "🐤",
      stock: "In Stock",
      description:
        "Budgies are small active birds and very popular pets.",
    },
  ];

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // NORMALIZE VALUE
  // ==================================================

  const normalizeValue = (value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  // ==================================================
  // CREATE UNIQUE PRODUCT KEY
  // ==================================================

  const getProductKey = (pet) => {
    const name = normalizeValue(pet.name);
    const price = Number(pet.price) || 0;
    const type = normalizeValue(pet.type);

    return `${name}|||${price}|||${type}`;
  };

  // ==================================================
  // REMOVE DUPLICATE PRODUCTS
  // ==================================================

  const removeDuplicatePets = (products) => {
    if (!Array.isArray(products)) {
      return [];
    }

    const seen = new Set();
    const uniqueProducts = [];

    for (const pet of products) {
      if (!pet) {
        continue;
      }

      const key = getProductKey(pet);

      if (seen.has(key)) {
        console.log(
          "⚠️ Duplicate product hidden:",
          pet.name,
          pet.price,
          pet.type
        );

        continue;
      }

      seen.add(key);
      uniqueProducts.push(pet);
    }

    return uniqueProducts;
  };

  // ==================================================
  // LOAD PRODUCTS
  // ==================================================

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);

      console.log("🐦 Loading products from Supabase...");

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .order("id", { ascending: true });

      // ==================================================
      // SUPABASE ERROR
      // ==================================================

      if (error) {
        console.error("❌ Supabase load error:", error);

        const saved = localStorage.getItem("pets");

        if (saved) {
          try {
            const localPets = JSON.parse(saved);

            const uniquePets =
              removeDuplicatePets(localPets);

            setPets(uniquePets);
          } catch (localError) {
            console.error(
              "❌ LocalStorage error:",
              localError
            );

            setPets([]);
          }
        } else {
          setPets([]);
        }

        return;
      }

      // ==================================================
      // SUPABASE EMPTY
      // ==================================================

      if (!data || data.length === 0) {
        console.log(
          "⚠️ Supabase pets table is empty."
        );

        const { data: insertedData, error: insertError } =
          await supabase
            .from("pets")
            .insert(defaultPets)
            .select("*");

        if (insertError) {
          console.error(
            "❌ Default products insert error:",
            insertError
          );

          setPets([]);
          return;
        }

        const uniquePets =
          removeDuplicatePets(insertedData || []);

        setPets(uniquePets);

        localStorage.setItem(
          "pets",
          JSON.stringify(uniquePets)
        );

        return;
      }

      // ==================================================
      // SUPABASE HAS PRODUCTS
      // ==================================================

      console.log(
        "✅ Products found in Supabase:",
        data.length
      );

      /*
       * IMPORTANT:
       *
       * Supabase se aaye products ko
       * duplicate filter se pass karenge.
       *
       * localStorage ko merge nahi karenge.
       */

      const uniquePets =
        removeDuplicatePets(data);

      console.log(
        "✅ Unique products:",
        uniquePets.length
      );

      console.log(
        "⚠️ Hidden duplicates:",
        data.length - uniquePets.length
      );

      setPets(uniquePets);

      localStorage.setItem(
        "pets",
        JSON.stringify(uniquePets)
      );
    } catch (error) {
      console.error(
        "❌ Pet loading error:",
        error
      );

      const saved = localStorage.getItem("pets");

      if (saved) {
        try {
          const localPets = JSON.parse(saved);

          const uniquePets =
            removeDuplicatePets(localPets);

          setPets(uniquePets);
        } catch (localError) {
          console.error(
            "❌ LocalStorage parse error:",
            localError
          );

          setPets([]);
        }
      } else {
        setPets([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // ADD PET
  // ==================================================

  const addPet = async (pet) => {
    try {
      const newPet = {
        name: String(pet.name || "").trim(),

        price:
          Number(pet.price) || 0,

        type:
          String(pet.type || "").trim(),

        image:
          pet.image || null,

        emoji:
          pet.emoji || "🐦",

        stock:
          pet.stock || "In Stock",

        description:
          pet.description ||
          "Healthy and beautiful pet bird.",
      };

      // ==================================================
      // PRODUCT NAME CHECK
      // ==================================================

      if (!newPet.name) {
        alert("Product name required.");
        return;
      }

      // ==================================================
      // CHECK DUPLICATE IN SUPABASE
      // ==================================================

      const { data: existingProducts, error: checkError } =
        await supabase
          .from("pets")
          .select("*")
          .ilike("name", newPet.name);

      if (checkError) {
        console.error(
          "❌ Duplicate check error:",
          checkError
        );
      }

      if (existingProducts && existingProducts.length > 0) {
        const duplicateExists =
          existingProducts.some((existingPet) => {
            return (
              normalizeValue(existingPet.name) ===
                normalizeValue(newPet.name) &&
              Number(existingPet.price) ===
                Number(newPet.price) &&
              normalizeValue(existingPet.type) ===
                normalizeValue(newPet.type)
            );
          });

        if (duplicateExists) {
          alert(
            "Ye product already added hai."
          );
          return;
        }
      }

      // ==================================================
      // INSERT
      // ==================================================

      console.log(
        "➕ Adding product:",
        newPet
      );

      const {
        data,
        error,
      } = await supabase
        .from("pets")
        .insert([newPet])
        .select("*")
        .single();

      if (error) {
        console.error(
          "❌ Add pet error:",
          error
        );

        alert(
          "Product add nahi hua. Supabase error check karo."
        );

        return;
      }

      // ==================================================
      // UPDATE STATE
      // ==================================================

      const updatedPets =
        removeDuplicatePets([
          ...pets,
          data,
        ]);

      setPets(updatedPets);

      localStorage.setItem(
        "pets",
        JSON.stringify(updatedPets)
      );

      console.log(
        "✅ Product added successfully:",
        data
      );
    } catch (error) {
      console.error(
        "❌ Add product error:",
        error
      );

      alert(
        "Product add karte waqt error aaya."
      );
    }
  };

  // ==================================================
  // DELETE PET
  // ==================================================

  const deletePet = async (id) => {
    try {
      console.log(
        "🗑️ Deleting product:",
        id
      );

      const {
        error,
      } = await supabase
        .from("pets")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "❌ Delete pet error:",
          error
        );

        alert(
          "Product delete nahi hua."
        );

        return;
      }

      const updatedPets =
        pets.filter(
          (pet) => pet.id !== id
        );

      setPets(updatedPets);

      localStorage.setItem(
        "pets",
        JSON.stringify(updatedPets)
      );

      console.log(
        "✅ Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "❌ Delete product error:",
        error
      );

      alert(
        "Product delete karte waqt error aaya."
      );
    }
  };

  // ==================================================
  // UPDATE PET
  // ==================================================

  const updatePet = async (id, data) => {
    try {
      const updatedData = {};

      // NAME
      if (data.name !== undefined) {
        updatedData.name =
          String(data.name).trim();
      }

      // PRICE
      if (data.price !== undefined) {
        updatedData.price =
          Number(data.price) || 0;
      }

      // TYPE
      if (data.type !== undefined) {
        updatedData.type =
          String(data.type).trim();
      }

      // IMAGE
      if (data.image !== undefined) {
        updatedData.image =
          data.image;
      }

      // EMOJI
      if (data.emoji !== undefined) {
        updatedData.emoji =
          data.emoji;
      }

      // STOCK
      if (data.stock !== undefined) {
        updatedData.stock =
          data.stock;
      }

      // DESCRIPTION
      if (data.description !== undefined) {
        updatedData.description =
          data.description;
      }

      console.log(
        "✏️ Updating product:",
        id,
        updatedData
      );

      // ==================================================
      // UPDATE SUPABASE
      // ==================================================

      const {
        data: updatedPet,
        error,
      } = await supabase
        .from("pets")
        .update(updatedData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error(
          "❌ Update pet error:",
          error
        );

        alert(
          "Product update nahi hua."
        );

        return;
      }

      // ==================================================
      // UPDATE LOCAL STATE
      // ==================================================

      const updatedPets =
        pets.map((pet) =>
          pet.id === id
            ? updatedPet
            : pet
        );

      const uniquePets =
        removeDuplicatePets(
          updatedPets
        );

      setPets(uniquePets);

      localStorage.setItem(
        "pets",
        JSON.stringify(uniquePets)
      );

      console.log(
        "✅ Product updated successfully:",
        updatedPet
      );
    } catch (error) {
      console.error(
        "❌ Update product error:",
        error
      );

      alert(
        "Product update karte waqt error aaya."
      );
    }
  };

  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
        }}
      >
        Loading products...
      </div>
    );
  }

  // ==================================================
  // PROVIDER
  // ==================================================

  return (
    <PetContext.Provider
      value={{
        pets,
        addPet,
        deletePet,
        updatePet,
        loadPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export default PetProvider;