const updatePet=(id,data)=>{

const updatedPets=pets.map((pet)=>{

if(pet.id===id){

return {

...pet,

name:
data.name ?? pet.name,

price:
data.price !== undefined
? Number(data.price)
: pet.price,

type:
data.type ?? pet.type,

image:
data.image !== undefined
? data.image
: pet.image,

emoji:
data.emoji ?? pet.emoji ?? "🐦",

description:
data.description ?? pet.description,

stock:
data.stock ?? pet.stock ?? "In Stock"

};

}

return pet;

});


savePets(updatedPets);

};