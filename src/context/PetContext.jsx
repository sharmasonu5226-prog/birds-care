import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabaseClient";


export const PetContext = createContext(null);



function PetProvider({ children }) {


  const [pets, setPets] = useState([]);

  const [loading, setLoading] = useState(true);




  // ===============================
  // REMOVE DUPLICATE
  // ===============================

  const removeDuplicates = (list)=>{

    const seen = new Set();

    return list.filter((item)=>{

      const key = String(item.id);

      if(seen.has(key)){
        return false;
      }

      seen.add(key);

      return true;

    });

  };





  // ===============================
  // LOAD PRODUCTS FROM SUPABASE
  // ===============================


  const loadPets = async()=>{

    try{


      setLoading(true);



      const {
        data,
        error
      } = await supabase

      .from("pets")

      .select("*")

      .order("id",{
        ascending:false
      });




      if(error){

        console.log(
          "Load Error",
          error
        );

        return;

      }




      const unique =
        removeDuplicates(
          data || []
        );



      console.log(
        "Products Loaded:",
        unique.length
      );



      setPets(unique);



    }catch(error){

      console.log(
        "Loading Error",
        error
      );


    }finally{


      setLoading(false);


    }


  };





  useEffect(()=>{


    loadPets();


  },[]);




  // ===============================
  // ADD PRODUCT
  // ===============================


  const addPet = async(petData)=>{


    try{


      const singleOld =
        Number(petData.singleOldPrice) || 0;


      const single =
        Number(petData.singlePrice) || 0;



      const pairOld =
        Number(petData.pairOldPrice) || 0;



      const pair =
        Number(petData.pairPrice) || 0;




      const cleanData = {


        name:
        petData.name || "",



        price:
        single,



        type:
        petData.type || "",



        image:
        petData.image || "",



        description:
        petData.description || "",



        stock:
        petData.stock || "In Stock",



        emoji:
        petData.emoji || "🐦",



        singleOldPrice:
        singleOld,



        singlePrice:
        single,



        pairOldPrice:
        pairOld,



        pairPrice:
        pair,



        single_discount:

        singleOld > single

        ?

        Math.round(
          ((singleOld-single)
          /
          singleOld)
          *
          100
        )

        :

        0,



        pair_discount:

        pairOld > pair

        ?

        Math.round(
          ((pairOld-pair)
          /
          pairOld)
          *
          100
        )

        :

        0,


      };      const {
        data,
        error
      } = await supabase

      .from("pets")

      .insert([
        cleanData
      ])

      .select("*")

      .single();




      if(error){

        console.log(
          "Add Error",
          error
        );


        return {
          error
        };

      }





      console.log(
        "Added Product:",
        data
      );





      setPets((prev)=>{


        const updated = [

          ...prev,

          data

        ];



        return removeDuplicates(
          updated
        );


      });




      return data;




    }catch(error){


      console.log(
        "Add Catch Error",
        error
      );


      return {
        error
      };


    }


  };







  // ===============================
  // UPDATE PRODUCT
  // ===============================


  const updatePet = async(
    id,
    petData
  )=>{


    try{


      const {

        data,

        error

      } = await supabase


      .from("pets")


      .update(petData)


      .eq(
        "id",
        id
      )


      .select("*")


      .single();





      if(error){


        console.log(
          "Update Error",
          error
        );


        return {
          error
        };


      }





      setPets((prev)=>{


        return prev.map((pet)=>{


          if(
            String(pet.id)
            ===
            String(id)
          ){

            return data;

          }


          return pet;


        });


      });





      return data;




    }catch(error){


      console.log(
        error
      );


      return {
        error
      };


    }



  };







  // ===============================
  // DELETE PRODUCT
  // ===============================


  const deletePet = async(id)=>{


    try{


      const {

        error

      } = await supabase


      .from("pets")


      .delete()


      .eq(
        "id",
        id
      );





      if(error){


        console.log(
          "Delete Error",
          error
        );


        return {
          error
        };


      }





      setPets((prev)=>{


        return prev.filter(
          (pet)=>

          String(pet.id)
          !==
          String(id)

        );


      });





      return true;




    }catch(error){


      console.log(
        error
      );


      return {
        error
      };


    }



  };  // ===============================
  // REFRESH
  // ===============================


  const refreshPets = async()=>{

    await loadPets();

  };






  return (

    <PetContext.Provider

      value={{

        pets,

        loading,


        addPet,

        updatePet,

        deletePet,


        loadPets,

        refreshPets


      }}

    >

      {children}

    </PetContext.Provider>


  );


}



export default PetProvider;