import { createContext, useState } from "react";


export const CategoryContext = createContext(null);



function CategoryProvider({ children }) {



const defaultCategories = [

{
id:1,
name:"Parrot",
emoji:"🦜",
image:""
},

{
id:2,
name:"Love Bird",
emoji:"🐥",
image:""
},

{
id:3,
name:"Cockatiel",
emoji:"🕊️",
image:""
},

{
id:4,
name:"Budgie",
emoji:"🐤",
image:""
},

{
id:5,
name:"Finch",
emoji:"🐦",
image:""
}

];




// =====================
// LOAD CATEGORY
// =====================

const [categories,setCategories]=useState(()=>{


const saved=localStorage.getItem("categories");


if(saved){

try{

return JSON.parse(saved);

}

catch(error){

console.log(error);

}

}



localStorage.setItem(

"categories",

JSON.stringify(defaultCategories)

);


return defaultCategories;


});






// =====================
// SAVE FUNCTION
// =====================

const saveCategories=(data)=>{


setCategories(data);


localStorage.setItem(

"categories",

JSON.stringify(data)

);


};






// =====================
// ADD CATEGORY
// =====================

const addCategory=(category)=>{


const newCategory={


id:Date.now(),


name:category.name,


emoji:category.emoji || "🐦",


image:category.image || ""



};



const updated=[

...categories,

newCategory

];



saveCategories(updated);


};






// =====================
// DELETE CATEGORY
// =====================

const removeCategory=(id)=>{


const updated=categories.filter(

(item)=>item.id!==id

);



saveCategories(updated);


};







// =====================
// UPDATE CATEGORY
// =====================

const updateCategory=(id,data)=>{


const updated=categories.map((item)=>{


if(item.id===id){


return {


...item,


name:
data.name !== undefined
? data.name
: item.name,



emoji:
data.emoji !== undefined
? data.emoji
: item.emoji,



image:
data.image !== undefined
? data.image
: item.image



};


}



return item;


});



saveCategories(updated);


};







return (


<CategoryContext.Provider

value={{

categories,

addCategory,

removeCategory,

updateCategory

}}

>


{children}


</CategoryContext.Provider>


);


}



export default CategoryProvider;