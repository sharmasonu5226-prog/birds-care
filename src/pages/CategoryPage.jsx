import { useContext, useState } from "react";

import { CategoryContext } from "../context/CategoryContext";



function CategoryPage(){



const {

categories,
addCategory,
removeCategory,
updateCategory

}=useContext(CategoryContext);




const [catName,setCatName]=useState("");

const [catEmoji,setCatEmoji]=useState("");

const [catImage,setCatImage]=useState("");



const [editCategory,setEditCategory]=useState({});





// IMAGE READER

const readImage=(file,callback)=>{


const reader=new FileReader();


reader.onload=()=>{

callback(reader.result);

};



reader.readAsDataURL(file);


};







// ADD IMAGE

const handleCategoryImage=(e)=>{


const file=e.target.files[0];


if(!file)return;



readImage(file,(img)=>{


setCatImage(img);


});


};







// EDIT IMAGE

const handleEditCategoryImage=(e,id)=>{


const file=e.target.files[0];


if(!file)return;



readImage(file,(img)=>{


setEditCategory((prev)=>({


...prev,


[id]:{


...(prev[id] || {}),


image:img


}


}));


});


};








// ADD CATEGORY

const handleAddCategory=(e)=>{


e.preventDefault();



if(!catName){

alert("Enter category name");

return;

}



addCategory({

id:Date.now(),

name:catName,

emoji:catEmoji || "🐦",

image:catImage || ""


});



setCatName("");

setCatEmoji("");

setCatImage("");



alert("Category Added");


};








// CHANGE CATEGORY

const changeCategory=(id,field,value)=>{


setEditCategory((prev)=>({


...prev,


[id]:{


...(prev[id] || {}),


[field]:value


}


}));


};








// UPDATE CATEGORY

const handleUpdateCategory=(cat)=>{


const data=editCategory[cat.id] || {};



updateCategory(

cat.id,

{

name:data.name ?? cat.name,

emoji:data.emoji ?? cat.emoji,

image:data.image ?? cat.image

}

);



alert("Category Updated");


};







return (

<div className="admin-page">


<h1>
Manage Categories
</h1>




<input

placeholder="Category Name"

value={catName}

onChange={(e)=>setCatName(e.target.value)}

 />





<input

placeholder="Emoji"

value={catEmoji}

onChange={(e)=>setCatEmoji(e.target.value)}

/>





<input

type="file"

accept="image/*"

onChange={handleCategoryImage}

/>





<button

onClick={handleAddCategory}

>

Add Category

</button>






{

categories.map((cat)=>(


<div

key={cat.id}

className="category-admin-card"

>



<img

src={editCategory[cat.id]?.image || cat.image}

alt={cat.name}

width="150"

/>





<input

value={
editCategory[cat.id]?.name ?? cat.name
}

onChange={(e)=>

changeCategory(

cat.id,

"name",

e.target.value

)

}

/>






<input

type="file"

accept="image/*"

onChange={(e)=>

handleEditCategoryImage(e,cat.id)

}

/>







<button

onClick={()=>handleUpdateCategory(cat)}

>

Update

</button>







<button

onClick={()=>removeCategory(cat.id)}

>

Delete

</button>





</div>


))


}




</div>

);


}



export default CategoryPage;