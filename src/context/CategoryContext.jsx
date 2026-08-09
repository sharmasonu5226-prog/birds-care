import { createContext, useState } from "react";

export const CategoryContext = createContext(null);

function CategoryProvider({ children }) {
  const defaultCategories = [
    {
      id: 1,
      name: "Parrot",
      emoji: "🦜",
      image: "",
    },
    {
      id: 2,
      name: "Love Bird",
      emoji: "🐥",
      image: "",
    },
    {
      id: 3,
      name: "Cockatiel",
      emoji: "🕊️",
      image: "",
    },
    {
      id: 4,
      name: "Budgie",
      emoji: "🐤",
      image: "",
    },
    {
      id: 5,
      name: "Finch",
      emoji: "🐦",
      image: "",
    },
  ];

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultCategories;
      }
    }

    localStorage.setItem(
      "categories",
      JSON.stringify(defaultCategories)
    );

    return defaultCategories;
  });

  const addCategory = (category) => {
    const updated = [
      ...categories,
      {
        id: Date.now(),
        name: category.name,
        emoji: category.emoji || "🐦",
        image: category.image || "",
      },
    ];

    setCategories(updated);

    localStorage.setItem(
      "categories",
      JSON.stringify(updated)
    );
  };

  const removeCategory = (id) => {
    const updated = categories.filter(
      (item) => item.id !== id
    );

    setCategories(updated);

    localStorage.setItem(
      "categories",
      JSON.stringify(updated)
    );
  };

  const updateCategory = (id, data) => {
    const updated = categories.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          name: data.name || item.name,
          emoji: data.emoji || item.emoji,
          image: data.image || item.image,
        };
      }

      return item;
    });

    setCategories(updated);

    localStorage.setItem(
      "categories",
      JSON.stringify(updated)
    );
  };

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