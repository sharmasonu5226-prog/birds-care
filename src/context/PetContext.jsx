import { createContext, useState } from "react";

export const PetContext = createContext(null);

function PetProvider({ children }) {
  const defaultPets = [
    {
      id: 1,
      name: "African Grey",
      price: 15000,
      type: "Parrot",
      image: null,
      emoji: "🐦",
      description:
        "African Grey is one of the smartest parrots and a very friendly bird.",
    },
    {
      id: 2,
      name: "Love Bird",
      price: 2500,
      type: "Love Bird",
      image: null,
      emoji: "🐥",
      description:
        "Love Birds are colorful, social and perfect for beginners.",
    },
    {
      id: 3,
      name: "Cockatiel",
      price: 6000,
      type: "Cockatiel",
      image: null,
      emoji: "🕊️",
      description:
        "Cockatiels are calm, playful and easy to train.",
    },
    {
      id: 4,
      name: "Macaw",
      price: 45000,
      type: "Parrot",
      image: null,
      emoji: "🦜",
      description:
        "Macaws are beautiful large parrots with colorful feathers.",
    },
    {
      id: 5,
      name: "Budgie",
      price: 1800,
      type: "Budgie",
      image: null,
      emoji: "🐤",
      description:
        "Budgies are small active birds and very popular pets.",
    },
  ];

  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem("pets");

    if (saved) {
      try {
        const savedPets = JSON.parse(saved);

        // Purane emoji image paths ko automatically correct karo
        const fixedPets = savedPets.map((pet) => {
          const oldEmoji =
            pet.image &&
            !pet.image.includes("/") &&
            !pet.image.includes(".") &&
            pet.image.length <= 4;

          if (oldEmoji) {
            return {
              ...pet,
              image: null,
              emoji: pet.image,
            };
          }

          return {
            ...pet,
            emoji: pet.emoji || "🐦",
          };
        });

        return fixedPets;
      } catch (error) {
        console.log("Pet data error:", error);
      }
    }

    localStorage.setItem(
      "pets",
      JSON.stringify(defaultPets)
    );

    return defaultPets;
  });

  const savePets = (updatedPets) => {
    setPets(updatedPets);

    localStorage.setItem(
      "pets",
      JSON.stringify(updatedPets)
    );
  };

  const addPet = (pet) => {
    const newPet = {
      id: Date.now(),
      name: pet.name,
      price: Number(pet.price),
      type: pet.type,
      image: pet.image || null,
      emoji: pet.emoji || "🐦",
      description:
        pet.description ||
        "Healthy and beautiful pet bird.",
    };

    const updatedPets = [
      ...pets,
      newPet,
    ];

    savePets(updatedPets);
  };

  const deletePet = (id) => {
    const updatedPets = pets.filter(
      (pet) => pet.id !== id
    );

    savePets(updatedPets);
  };

  const updatePet = (id, data) => {
    const updatedPets = pets.map((pet) => {
      if (pet.id === id) {
        return {
          ...pet,
          name: data.name || pet.name,
          price:
            Number(data.price) || pet.price,
          type: data.type || pet.type,
          image:
            data.image !== undefined
              ? data.image
              : pet.image,
          emoji:
            data.emoji || pet.emoji || "🐦",
          description:
            data.description || pet.description,
        };
      }

      return pet;
    });

    savePets(updatedPets);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        addPet,
        deletePet,
        updatePet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export default PetProvider;