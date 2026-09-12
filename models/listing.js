const mongoose = require("mongoose");
const Review = require("./review");
const listingschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        url:String,
        filename:String,
    },

    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic cities", "Mountain", "Castles", "Amazing pools", "Camping", "Farms", "Arctic"],
        default: "Trending",
    },
    reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }
],
owner :{
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
},
geometry : { type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
},
});

//middleware:if listing is delete then all review should be delete automatically from the database
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in :listing.reviews}});
}})




const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;

