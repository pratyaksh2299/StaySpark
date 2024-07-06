const mongoose=require('mongoose');
let initdata=require('./data.js');
const Listing=require('../models/listing.js');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

main().then((res)=>{
    console.log('connect to db');
}).catch((err)=>{
    console.log(err);
});

let initDB =async ()=>{
    await Listing.deleteMany({});
    initdata=initdata.map((obj)=>({...obj,owner:'667918c5af9f41ff7a61e1fd'}));
    await Listing.insertMany(initdata);
}

initDB();

