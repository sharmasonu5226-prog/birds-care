import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabaseClient";


export const CategoryContext =
  createContext(null);


function CategoryProvider({ children }) {


  const [categories, setCategories] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  // =========================
  // LOCAL SAVE
  // =========================

  const saveLocal = (data) => {

    localStorage.setItem(
      "categories",
      JSON.stringify(data)
    );

  };


  // =========================
  // LOAD CATEGORY
  // =========================

  const loadCategories = async () => {

    try {

      setLoading(true);

      const {
        data,
        error
      } = await supabase

        .from("categories")

        .select("*")

        .order("id", {
          ascending: true
        });


      if (error) {

        console.log(
          "Category load error",
          error
        );

        const local =
          JSON.parse(
            localStorage.getItem(
              "categories"
            )
          ) || [];

        setCategories(local);

        return;
      }


      if (!data || data.length === 0) {

        setCategories([]);

        saveLocal([]);

        return;
      }


      setCategories(data);

      saveLocal(data);


    } catch (error) {

      console.log(
        "Category error",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadCategories();

  }, []);


  // =========================
  // ADD CATEGORY
  // =========================

  const addCategory = async (category) => {

    try {

      const cleanData = {

        name:
          String(category.name || "").trim(),

        emoji:
          category.emoji || "🐦",

        image:
          category.image || null,

      };


      if (!cleanData.name) {

        console.log(
          "Category name missing"
        );

        return {
          error: "Category name required"
        };

      }


      const {
        data,
        error
      } = await supabase

        .from("categories")

        .insert([
          cleanData
        ])

        .select("*")
        .single();


      if (error) {

        console.log(
          "Add category error",
          error
        );

        return {
          error
        };

      }


      const updated = [
        ...categories,
        data
      ];


      setCategories(updated);

      saveLocal(updated);


      return data;


    } catch (error) {

      console.log(
        "Add category catch error",
        error
      );

      return {
        error
      };

    }

  };


  // =========================
  // DELETE CATEGORY
  // =========================

  const removeCategory = async (id) => {

  try {

    if (id === undefined || id === null) {

      alert("Category ID nahi mila ❌");

      return {
        error: "Category ID missing"
      };

    }


    // Pehle screen se turant remove karo
    const oldCategories = [...categories];

    const updated = categories.filter(
      (item) =>
        String(item.id) !== String(id)
    );


    setCategories(updated);

    saveLocal(updated);


    // Ab Supabase se delete karo
    const {
      error
    } = await supabase

      .from("categories")

      .delete()

      .eq(
        "id",
        id
      );


    if (error) {

      console.log(
        "Delete category error:",
        error
      );


      // Agar database delete fail ho
      // to purani list wapas lao
      setCategories(oldCategories);

      saveLocal(oldCategories);


      alert(
        "Category delete nahi hui ❌\n\n" +
        error.message
      );


      return {
        error
      };

    }


    console.log(
      "Category deleted:",
      id
    );


    alert(
      "Category Deleted Successfully ✅"
    );


    return true;


  } catch (error) {


    console.log(
      "Delete category catch error:",
      error
    );


    alert(
      "Category delete nahi hui ❌"
    );


    return {
      error
    };

  }

};


  // =========================
  // UPDATE CATEGORY
  // =========================

  const updateCategory = async (
    id,
    updateData
  ) => {

    try {

      const {
        data,
        error
      } = await supabase

        .from("categories")

        .update(updateData)

        .eq(
          "id",
          id
        )

        .select("*")
        .single();


      if (error) {

        console.log(
          "Update category error",
          error
        );

        return {
          error
        };

      }


      const updated =
        categories.map(
          (item) =>

            String(item.id) ===
            String(id)

              ? data

              : item
        );


      setCategories(updated);

      saveLocal(updated);


      return data;


    } catch (error) {

      console.log(
        "Update category catch error",
        error
      );

      return {
        error
      };

    }

  };


  // =========================
  // REFRESH
  // =========================

  const refreshCategories =
    async () => {

      await loadCategories();

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

        loading,

        addCategory,

        removeCategory,

        updateCategory,

        loadCategories,

        refreshCategories,

      }}

    >

      {children}

    </CategoryContext.Provider>

  );

}


export default CategoryProvider;