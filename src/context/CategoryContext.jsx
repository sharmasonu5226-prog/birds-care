import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const CategoryContext = createContext(null);

function CategoryProvider({ children }) {
  const defaultCategories = [
    {
      name: "Parrot",
      emoji: "🦜",
      image: null,
    },
    {
      name: "Love Bird",
      emoji: "🐥",
      image: null,
    },
    {
      name: "Cockatiel",
      emoji: "🕊️",
      image: null,
    },
    {
      name: "Budgie",
      emoji: "🐤",
      image: null,
    },
    {
      name: "Finch",
      emoji: "🐦",
      image: null,
    },
  ];

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase category load error:", error);

        const saved = localStorage.getItem("categories");

        if (saved) {
          try {
            setCategories(JSON.parse(saved));
          } catch {
            setCategories(defaultCategories);
          }
        } else {
          setCategories(defaultCategories);
        }

        setLoading(false);
        return;
      }

      // =========================
      // DATABASE EMPTY
      // =========================

      if (!data || data.length === 0) {
        const saved = localStorage.getItem("categories");

        let localCategories = [];

        if (saved) {
          try {
            localCategories = JSON.parse(saved);
          } catch (error) {
            console.error("Local category error:", error);
          }
        }

        const categoriesToUpload =
          localCategories.length > 0
            ? localCategories
            : defaultCategories;

        const cleanCategories = categoriesToUpload.map((category) => ({
          name: category.name,
          emoji: category.emoji || "🐦",
          image: category.image || null,
        }));

        const {
          data: insertedData,
          error: insertError,
        } = await supabase
          .from("categories")
          .insert(cleanCategories)
          .select("*");

        if (insertError) {
          console.error(
            "Supabase category insert error:",
            insertError
          );

          setCategories(categoriesToUpload);
          setLoading(false);
          return;
        }

        setCategories(insertedData || []);

        localStorage.setItem(
          "categories",
          JSON.stringify(insertedData || [])
        );

        setLoading(false);
        return;
      }

      // =========================
      // DATABASE HAS DATA
      // =========================

      setCategories(data);

      localStorage.setItem(
        "categories",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Category loading error:", error);

      const saved = localStorage.getItem("categories");

      if (saved) {
        try {
          setCategories(JSON.parse(saved));
        } catch {
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
    }

    setLoading(false);
  };

  // =========================
  // ADD CATEGORY
  // =========================

  const addCategory = async (category) => {
    const newCategory = {
      name: category.name,
      emoji: category.emoji || "🐦",
      image: category.image || null,
    };

    const {
      data,
      error,
    } = await supabase
      .from("categories")
      .insert([newCategory])
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Add category error:", error);
      alert("Category add nahi hui.");
      return;
    }

    if (!data) {
      console.error(
        "Category insert hua lekin data nahi mila."
      );

      alert("Category add nahi hui.");
      return;
    }

    const updatedCategories = [
      ...categories,
      data,
    ];

    setCategories(updatedCategories);

    localStorage.setItem(
      "categories",
      JSON.stringify(updatedCategories)
    );
  };

  // =========================
  // DELETE CATEGORY
  // =========================

  const removeCategory = async (id) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert("Category delete nahi hui.");
      return;
    }

    const updatedCategories =
      categories.filter(
        (item) =>
          String(item.id) !== String(id)
      );

    setCategories(updatedCategories);

    localStorage.setItem(
      "categories",
      JSON.stringify(updatedCategories)
    );
  };

  // =========================
  // UPDATE CATEGORY
  // =========================

  const updateCategory = async (id, data) => {
    try {
      const existingCategory =
        categories.find(
          (item) =>
            String(item.id) === String(id)
        );

      if (!existingCategory) {
        console.error(
          "Category not found:",
          id
        );

        alert("Category nahi mili.");
        return;
      }

      // =========================
      // PREPARE UPDATE DATA
      // =========================

      const updatedData = {};

      if (data?.name !== undefined) {
        updatedData.name = data.name;
      }

      if (data?.emoji !== undefined) {
        updatedData.emoji = data.emoji;
      }

      if (data?.image !== undefined) {
        updatedData.image =
          data.image || null;
      }

      console.log(
        "Updating category:",
        id
      );

      console.log(
        "Update data:",
        updatedData
      );

      // Agar kuch bhi update nahi karna
      if (
        Object.keys(updatedData).length === 0
      ) {
        console.warn(
          "No category data to update."
        );

        return;
      }

      // =========================
      // UPDATE DATABASE
      // =========================

      const {
        error: updateError,
      } = await supabase
        .from("categories")
        .update(updatedData)
        .eq("id", id);

      if (updateError) {
        console.error(
          "Supabase category update error:",
          updateError
        );

        alert(
          "Category update nahi hui."
        );

        return;
      }

      // =========================
      // GET UPDATED CATEGORY
      // =========================

      const {
        data: updatedCategory,
        error: fetchError,
      } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) {
        console.error(
          "Updated category fetch error:",
          fetchError
        );

        // Database update ho chuka hai,
        // local state ko manually update kar do.

        const localUpdatedCategory = {
          ...existingCategory,
          ...updatedData,
          id: existingCategory.id,
        };

        const updatedCategories =
          categories.map((item) =>
            String(item.id) === String(id)
              ? localUpdatedCategory
              : item
          );

        setCategories(updatedCategories);

        localStorage.setItem(
          "categories",
          JSON.stringify(
            updatedCategories
          )
        );

        return;
      }

      // =========================
      // UPDATED CATEGORY NOT FOUND
      // =========================

      if (!updatedCategory) {
        console.error(
          "Category update ke baad row nahi mili."
        );

        // Local state ko bhi update kar do
        // kyunki database update successful ho sakta hai.

        const localUpdatedCategory = {
          ...existingCategory,
          ...updatedData,
          id: existingCategory.id,
        };

        const updatedCategories =
          categories.map((item) =>
            String(item.id) === String(id)
              ? localUpdatedCategory
              : item
          );

        setCategories(updatedCategories);

        localStorage.setItem(
          "categories",
          JSON.stringify(
            updatedCategories
          )
        );

        return;
      }

      // =========================
      // UPDATE REACT STATE
      // =========================

      const updatedCategories =
        categories.map((item) =>
          String(item.id) === String(id)
            ? updatedCategory
            : item
        );

      setCategories(updatedCategories);

      // =========================
      // UPDATE LOCAL STORAGE
      // =========================

      localStorage.setItem(
        "categories",
        JSON.stringify(
          updatedCategories
        )
      );

      console.log(
        "Category successfully updated:",
        updatedCategory
      );
    } catch (error) {
      console.error(
        "Category update unexpected error:",
        error
      );

      alert(
        "Category update nahi hui."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div>
        Loading categories...
      </div>
    );
  }

  // =========================
  // PROVIDER
  // =========================

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        removeCategory,
        updateCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryProvider;