const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../models/listing");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

main()
    .then(()=>{
        console.log("mongodb connected succesfully");
    }).catch((err)=>{
        console.log(err);
    })


const initdb = async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "698e3510fd21fd72076bc28e"
}));

    await listing.insertMany(initdata.data); 
    console.log("Data was initialized")
}

initdb();