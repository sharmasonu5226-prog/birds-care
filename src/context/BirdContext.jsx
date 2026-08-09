import { createContext, useState } from "react";
import birdsData from "../data/birds";


export const BirdContext = createContext();



function BirdProvider({children}){


const [birds,setBirds] = useState(()=>{


const saved = localStorage.getItem("birds");


if(saved){

return JSON.parse(saved);

}


localStorage.setItem(

"birds",

JSON.stringify(birdsData)

);


return birdsData;


});








const addBird = (bird)=>{


const updated = [


...birds,


{

id:Date.now(),

name:bird.name,

price:bird.price,

type:bird.type,

image:bird.image,

description:bird.description || ""

}


];



setBirds(updated);



localStorage.setItem(

"birds",

JSON.stringify(updated)

);



};









const deleteBird = (id)=>{


const updated = birds.filter(

(bird)=>bird.id !== id

);



setBirds(updated);



localStorage.setItem(

"birds",

JSON.stringify(updated)

);



};









const updateBird = (id,data)=>{


const updated = birds.map((bird)=>{


if(bird.id === id){


return {


...bird,


name:data.name || bird.name,

price:data.price || bird.price,

type:data.type || bird.type,

image:data.image || bird.image,

description:data.description || bird.description


};


}



return bird;



});





setBirds(updated);



localStorage.setItem(

"birds",

JSON.stringify(updated)

);



};









return (


<BirdContext.Provider


value={{


birds,

addBird,

deleteBird,

updateBird


}}


>


{children}


</BirdContext.Provider>


);



}



export default BirdProvider;